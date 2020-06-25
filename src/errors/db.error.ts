import { CustomError } from './custom.error';

export class DbError extends CustomError {
  constructor(details?: string | Error, stack?: string) {
    super('DB_ERROR', details, stack);
  }
}
