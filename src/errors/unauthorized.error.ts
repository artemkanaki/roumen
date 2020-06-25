import { WebError } from './web.error';

export class UnauthorizedError extends WebError {
  constructor(details?: string | Error, stack?: string) {
    super('UNAUTHORIZED', 404, details, stack);
  }
}
