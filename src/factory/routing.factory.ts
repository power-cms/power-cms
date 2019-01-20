import { ActionType, IActionHandler, IService } from '@power-cms/common/application';
import * as pluralize from 'pluralize';

export interface IRouting {
  [key: string]: string;
}

export const createRouting = (service: IService): IRouting => {
  return service.actions
    .filter((action: IActionHandler) => !action.private)
    .reduce(
      (routing: IRouting, action: IActionHandler) => ({
        ...routing,
        ...createRoutingAction(service, action),
      }),
      {}
    );
};

const createRoutingAction = (service: IService, action: IActionHandler): IRouting => ({
  [`${getHTTPMethod(action.type)} ${getPath(service, action)}`]: `${service.name}.${action.name}`,
});

const getHTTPMethod = (actionType: ActionType): string => {
  const dictionary = {
    [ActionType.COLLECTION]: 'GET',
    [ActionType.CREATE]: 'POST',
    [ActionType.DELETE]: 'DELETE',
    [ActionType.READ]: 'GET',
    [ActionType.UPDATE]: 'PUT',
  };

  return dictionary[actionType];
};

const getPath = (service: IService, action: IActionHandler): string => {
  const dictionary = {
    [ActionType.COLLECTION]: '',
    [ActionType.CREATE]: '',
    [ActionType.DELETE]: ':id',
    [ActionType.READ]: ':id',
    [ActionType.UPDATE]: ':id',
  };

  const regularActions = ['collection', 'create', 'delete', 'read', 'update'];
  const pluralizeExcluded = ['auth'];

  const prefix = pluralizeExcluded.indexOf(service.name) === -1 ? pluralize(service.name) : service.name;
  const link = dictionary[action.type] || null;
  const sufix = regularActions.indexOf(action.name) === -1 ? action.name : null;

  return [prefix, link, sufix].filter(part => part).join('/');
};
