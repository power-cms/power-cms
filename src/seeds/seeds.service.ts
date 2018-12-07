/* tslint:disable:no-hardcoded-credentials */
import { Service, ServiceBroker } from 'moleculer';

class SeedsService extends Service {
  constructor(broker: ServiceBroker) {
    super(broker);

    this.parseServiceSchema({
      name: 'seeds',
      started: this.started as any,
    });
  }

  public async started() {
    process.stdout.write('[Seeds] Starting seeds process...\n');

    const { id } = await this.broker.call('auth.register', {
      body: {
        username: 'Admin',
        email: 'admin@test.com',
        password: 'admin',
      },
    });

    await this.broker.call('user.grantRoles', {
      body: { roles: ['Admin'] },
      params: { id },
    });

    process.stdout.write('[Seeds] Done!\n');
    process.exit();
  }
}

export = SeedsService;
