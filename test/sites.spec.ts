import { ServiceBroker } from 'moleculer';
import * as request from 'supertest';
import { app, createServiceBroker } from './environment/service-broker';
import { createAdmin, createAdminToken } from './environment/fixtures/admin.fixture';

describe('Sites flow', () => {
  let broker: ServiceBroker;
  let siteId: string;

  beforeAll(async () => {
    broker = await createServiceBroker();
    await createAdmin(app, broker);

    const accessToken = await createAdminToken(app);
    const {
      body: { id },
    } = await request(app)
      .post('/api/sites')
      .send({ title: 'HomePage', content: 'Welcome!', url: 'home', type: 'text' })
      .set('Authorization', `JWT ${accessToken}`);

    siteId = id;
  });

  afterAll(async () => {
    await broker.stop();
  });

  it('Creates site as an admin', async () => {
    const accessToken = await createAdminToken(app);

    const { status, body } = await request(app)
      .post('/api/sites')
      .send({ title: 'Test', content: 'test', url: 'test-url', type: 'text' })
      .set('Authorization', `JWT ${accessToken}`);

    expect(status).toBe(200); //todo: should be 201
    expect(body.id).toBeDefined();
    expect(body.title).toBe('Test');
    expect(body.content).toBe('test');
    expect(body.url).toBe('test-url');
    expect(body.type).toBe('text');
  });

  it('Updates site as an admin', async () => {
    const accessToken = await createAdminToken(app);

    const updateResponse = await request(app)
      .put(`/api/sites/${siteId}`)
      .send({ title: 'HomePageEdited', content: 'Welcome Everyone!', url: 'home-page', type: 'text' })
      .set('Authorization', `JWT ${accessToken}`);

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.title).toBe('HomePageEdited');
    expect(updateResponse.body.content).toBe('Welcome Everyone!');
    expect(updateResponse.body.url).toBe('home-page');

    const getResponse = await request(app).get(`/api/sites/${siteId}`);

    expect(getResponse.status).toBe(200);
    expect(getResponse.body.title).toBe('HomePageEdited');
    expect(getResponse.body.content).toBe('Welcome Everyone!');
    expect(getResponse.body.url).toBe('home-page');
  });

  it('Gets site collection as unauthenticated user', async () => {
    const { status, body } = await request(app).get('/api/sites');

    expect(status).toBe(200);
    expect(Array.isArray(body.data)).toBeTruthy();
    expect(body.page).toBeDefined();
    expect(body.totalPages).toBeDefined();
  });

  it('Gets single site', async () => {
    const { status, body } = await request(app).get(`/api/sites/${siteId}`);

    expect(status).toBe(200);
    expect(body.id).toBeDefined();
  });

  it('Delets site as an admin', async () => {
    const accessToken = await createAdminToken(app);

    const {
      body: { id },
    } = await request(app)
      .post('/api/sites')
      .send({ title: 'Not Important', content: 'not important', url: 'not-important', type: 'text' })
      .set('Authorization', `JWT ${accessToken}`);

    const deleteResponse = await request(app)
      .delete(`/api/sites/${id}`)
      .set('Authorization', `JWT ${accessToken}`);

    expect(deleteResponse.status).toBe(200); //todo: should be 204

    const getResponse = await request(app).get(`/api/sites/${id}`);

    expect(getResponse.status).toBe(500); //todo: should be 404
  });
});
