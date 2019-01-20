/* tslint:disable:no-hardcoded-credentials */
import * as request from 'supertest';

const username = 'JohnDoe';
const password = 'P@$$word';

export const createUser = async (app: string): Promise<void> => {
  await request(app)
    .post('/api/auth/register')
    .send({ username, password, email: 'john@doe.com' });
};

export const createUserToken = async (app: string): Promise<string> => {
  const {
    body: { accessToken },
  } = await request(app)
    .post('/api/auth/login')
    .send({ login: username, password });

  return accessToken;
};
