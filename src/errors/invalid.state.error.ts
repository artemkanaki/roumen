import { CustomError } from './custom.error';

export class InvalidStateError extends CustomError {
  constructor(details?: string | Error, stack?: string) {
    super('INVALID_STATE', details, stack);
  }
}
