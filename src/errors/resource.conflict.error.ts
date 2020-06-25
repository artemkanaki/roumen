import { WebError } from './web.error';

export class ResourceConflictError extends WebError {
  constructor(details?: string | Error, stack?: string) {
    super('CONFLICT', 409, details, stack);
  }
}
