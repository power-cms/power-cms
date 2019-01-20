import { IActionHandler, IService } from '@power-cms/common/application';
import { Action, ActionParams, Actions, Context, Errors, ServiceSchema } from 'moleculer';

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
  params: (handler.validator as any) as ActionParams,
  handler: async ({ params: { body, query, params }, meta }: Context) => {
    const actionData = { data: body, params, auth: meta.auth };

    if (handler.authorize && !(await handler.authorize(actionData))) {
      if (!actionData.auth) {
        throw new Errors.MoleculerServerError('Unauthenticated', 401);
      }

      throw new Errors.MoleculerServerError('Forbidden', 403);
    }

    try {
      return await handler.handle(actionData);
    } catch (e) {
      throw e; // todo: proper application error handling
    }
  },
});
