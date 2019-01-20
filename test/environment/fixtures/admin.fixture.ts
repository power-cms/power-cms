/* tslint:disable:no-hardcoded-credentials */
import { ServiceBroker } from 'moleculer';
import * as request from 'supertest';

const username = 'Admin';
const password = 'P@$$word';

export const createAdmin = async (app: string, broker: ServiceBroker): Promise<void> => {
  const {
    body: { id },
  } = await request(app)
    .post('/api/auth/register')
    .send({ username, password, email: 'admin@localhost' });

  await broker.call('user.grantRoles', {
    body: { roles: ['Admin'] },
    params: { id },
  });
};

export const createAdminToken = async (app: string): Promise<string> => {
  const {
    body: { accessToken },
  } = await request(app)
    .post('/api/auth/login')
    .send({ login: username, password });

  return accessToken;
};
