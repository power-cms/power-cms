import { ServiceBroker } from 'moleculer';
import { config } from './test.config';

export const createServiceBroker = async (): Promise<ServiceBroker> => {
  const broker = new ServiceBroker(config);
  broker.loadServices('./src/services', '**/*.service.ts');

  await new Promise((resolve, reject) => {
    broker
      .start()
      .then(() => resolve())
      .catch((e: Error) => reject(e));
  });

  return broker;
};

export const app = 'http://localhost:3000';
