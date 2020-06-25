import * as Ajv from 'ajv';
import { Handler } from 'express';
import { InvalidRequestError } from '../errors';
import { MiddlewareFactory } from './middleware-factory';
import { LayerManager } from '../layer.manager';

export class RequestValidatorFactory extends MiddlewareFactory {
  private readonly _validator: Ajv.Ajv;

  constructor(layerManager: LayerManager) {
    super(layerManager);

    this._validator = new Ajv();
  }

  public generateMiddleware(schema): Handler {
    if (!schema) {
      throw new Error('`schema` should not be empty');
    }

    return (req, _res, next) => {
      const validate = this._validator.compile(schema);
      const valid = validate(req);

      if (valid) {
        return next();
      }

      next(new InvalidRequestError(validate.errors.map((error) => error.message).join('; ')));
    };
  }
}
