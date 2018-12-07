import * as Joi from 'joi';
import { Errors, GenericObject, Validator } from 'moleculer';

export class JoiValidator extends Validator {
  private validator: any;

  constructor() {
    super();
    this.validator = Joi;
  }

  public compile(schema: GenericObject) {
    return (params: any) => {
      return this.validate(params.body, schema);
    }
  }

  public validate(params: GenericObject, schema: GenericObject) {
    const res = this.validator.validate(params, schema, {abortEarly: false, allowUnknown: true});

    if (res.error) {
        throw new Errors.ValidationError(res.error.message, 'Validation', res.error.details);
    }

    return true;
  }
}
