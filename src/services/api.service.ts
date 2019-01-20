import { createService as createAuthService } from '@power-cms/auth-service';
import { IService } from '@power-cms/common/application';
import { createService as createSiteService } from '@power-cms/site-service';
import { createService as createUserService } from '@power-cms/user-service';
import { Errors, Service, ServiceBroker } from 'moleculer';
import * as ApiGateway from 'moleculer-web';
import { createRouting, IRouting } from '../factory/routing.factory';

class ApiService extends Service {
  constructor(broker: ServiceBroker) {
    super(broker);

    const aliases = [createSiteService(), createUserService(), createAuthService()].reduce(
      (routing: IRouting, service: IService) => ({
        ...routing,
        ...createRouting(service),
      }),
      {}
    );

    this.parseServiceSchema({
      name: 'api',
      mixins: [ApiGateway],
      settings: {
        port: process.env.PORT || 3000,
        routes: [
          {
            path: '/api',
            mergeParams: false,
            aliases,
            async onBeforeCall(ctx: any, route: any, req: any, res: any) {
              const authHeader = req.headers.authorization;
              if (authHeader) {
                const matches = authHeader.match(/JWT\s(.*)/);
                if (matches) {
                  const token = matches[1];

                  try {
                    ctx.meta.auth = await broker.call('auth.authenticate', { body: { token } });
                  } catch (e) {
                    throw new Errors.MoleculerServerError('Unauthenticated', 401);
                  }
                }
              }
            },
          },
        ],
        assets: {
          folder: 'public',
        },
      },
    });
  }
}

export = ApiService;
