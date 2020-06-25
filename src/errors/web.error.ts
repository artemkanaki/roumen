import { CustomError } from './custom.error';

export class WebError extends CustomError {
  private _status: number;

  constructor(message: string, status: number, details?: string | Error, stack?: string) {
    super(message, details, stack);

    this._status = status;
  }

  public get status() {
    return this._status;
  }
}
