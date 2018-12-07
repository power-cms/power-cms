import { IActionData, IRemoteProcedure } from '@power-cms/common/application';
import { ServiceBroker } from 'moleculer';

export const createRemoteProcedure = (serviceBroker: ServiceBroker): IRemoteProcedure => ({
  call: <T>(serviceName: string, actionName: string, action: IActionData): Promise<T> => {
    return (serviceBroker.call(
      `${serviceName}.${actionName}`,
      { body: action.data, params: action.params },
      { meta: { auth: action.auth } }
    ) as any) as Promise<T>;
  },
});
