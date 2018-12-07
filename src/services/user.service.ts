import { createService as createDomainService } from '@power-cms/user-service';
import { Service, ServiceBroker } from 'moleculer';
import { createLogger } from '../factory/logger.factory';
import { createRemoteProcedure } from '../factory/remote-procedure.factory';
import { createService } from '../factory/service.factory';

class UserService extends Service {
  constructor(broker: ServiceBroker) {
    super(broker);

    const logger = createLogger(this.broker.logger);
    const remoteProcedure = createRemoteProcedure(this.broker);
    const domainService = createDomainService(logger, remoteProcedure);
    const serviceSchema = createService(domainService);

    this.parseServiceSchema(serviceSchema);
  }
}

export = UserService;
