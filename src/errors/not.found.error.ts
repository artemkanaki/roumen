import { WebError } from './web.error';

export class NotFoundError extends WebError {
  constructor(details?: string | Error, stack?: string) {
    super('NOT_FOUND', 404, details, stack);
  }
}
