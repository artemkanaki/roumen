import { WebError } from './web.error';

export class UnknownError extends WebError {
  constructor(details?: string | Error, stack?: string) {
    super('UNKNOWN_ERROR', 500, details, stack);
  }
}
