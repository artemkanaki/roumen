import { CustomError } from './custom.error';

export class InvalidParamsError extends CustomError {
  constructor(details?: string | Error, stack?: string) {
    super('INVALID_PARAMS', details, stack);
  }
}
