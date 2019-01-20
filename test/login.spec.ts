import { ServiceBroker } from 'moleculer';
import * as request from 'supertest';
import { app, createServiceBroker } from './environment/service-broker';
import { createUser } from './environment/fixtures/user.fixture';

describe('Login flow', () => {
  let broker: ServiceBroker;

  beforeAll(async () => {
    broker = await createServiceBroker();
    await createUser(app);
  });

  afterAll(async () => {
    await broker.stop();
  });

  it('Loggs in successfully', async () => {
    const { body, status } = await request(app)
      .post('/api/auth/login')
      .send({ login: 'JohnDoe', password: 'P@$$word' });

    expect(status).toBe(200);
    expect(body.accessToken).toBeDefined();
    expect(body.refreshToken).toBeDefined();
  });

  it('Call request with access token', async () => {
    const {
      body: { accessToken },
    } = await request(app)
      .post('/api/auth/login')
      .send({ login: 'JohnDoe', password: 'P@$$word' });

    const { status } = await request(app)
      .get('/api/sites')
      .set('Authorization', `JWT ${accessToken}`);

    expect(status).toBe(200);
  });
});
