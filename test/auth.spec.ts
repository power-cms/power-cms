import { ServiceBroker } from 'moleculer';
import * as request from 'supertest';
import { app, createServiceBroker } from './environment/service-broker';
import { createUser, createUserToken } from './environment/fixtures/user.fixture';

describe('Authorization flow', () => {
  let broker: ServiceBroker;

  beforeAll(async () => {
    broker = await createServiceBroker();
    await createUser(app);
  });

  afterAll(async () => {
    await broker.stop();
  });

  it('Handles unauthenticated user', async () => {
    const { status } = await request(app)
      .post('/api/sites')
      .send({ title: 'Test', content: 'Test', url: 'test', type: 'text' });

    expect(status).toBe(401);
  });

  it('Handles unauthorized user', async () => {
    const accessToken = await createUserToken(app);

    const { status } = await request(app)
      .post('/api/sites')
      .send({ title: 'Test', content: 'Test', url: 'test', type: 'text' })
      .set('Authorization', `JWT ${accessToken}`);

    expect(status).toBe(403);
  });

  it("Doesn't accept fake JWT token", async () => {
    const { status } = await request(app)
      .post('/api/sites')
      .send({ title: 'Test', content: 'Test', url: 'test', type: 'text' })
      .set('Authorization', `JWT test`);

    expect(status).toBe(401);
  });

  it("Doesn't accept bearer token", async () => {
    const accessToken = await createUserToken(app);

    const { status } = await request(app)
      .post('/api/sites')
      .send({ title: 'Test', content: 'Test', url: 'test', type: 'text' })
      .set('Authorization', `Bearer ${accessToken}`);

    expect(status).toBe(401);
  });
});
