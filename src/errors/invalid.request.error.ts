import { WebError } from './web.error';

export class InvalidRequestError extends WebError {
  constructor(details?: string | Error, stack?: string) {
    super('INVALID_REQUEST', 400, details, stack);
  }
}
