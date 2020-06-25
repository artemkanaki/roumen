import { WebError } from './web.error';

export class ForbiddenError extends WebError {
  constructor(details?: string | Error, stack?: string) {
    super('FORBIDDEN', 403, details, stack);
  }
}
