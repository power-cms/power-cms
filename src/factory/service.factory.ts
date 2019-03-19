import { IActionData, IActionHandler, IService } from '@power-cms/common/application';
import { Action, Actions, Context, Errors, ServiceSchema } from 'moleculer';
import { getErrorCode } from '../exception/exception-code.parser';

export const createService = (service: IService): ServiceSchema => ({
  name: service.name,
  actions: createActions(service.actions),
});

const createActions = (handlers: IActionHandler[]): Actions => {
  return handlers
    .map((handler: IActionHandler) => createAction(handler))
    .reduce(
      (actions: Actions, action: Action) => ({
        ...actions,
        [String(action.name)]: action,
      }),
      {}
    );
};

const createAction = (handler: IActionHandler): Action => ({
  name: handler.name,
  handler: async ({ params: { body, query, params }, meta }: Context) => {
    const actionData: IActionData = { data: body, params, auth: meta.auth, query };

    if (handler.authorize && !(await handler.authorize(actionData))) {
      if (!actionData.auth) {
        throw new Errors.MoleculerError('Unauthenticated', 401);
      }

      throw new Errors.MoleculerError('Forbidden', 403);
    }

    try {
      return await handler.execute(actionData);
    } catch (e) {
      throw new Errors.MoleculerError(e.message, getErrorCode(e), 'ServiceError', e.details || e.data);
    }
  },
});
