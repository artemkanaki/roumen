export class CustomError extends Error {
  public message: string;

  private readonly _details: string;

  constructor(message: string, details?: string | Error, stack?: string) {
    super(message);

    if (details instanceof Error) {
      stack = details.stack;
      details = details.message;
    }

    this._details = details;
    this.stack = process.env.NODE_ENV === 'prod' ? null : stack || this.stack;
  }

  public get details() {
    return this._details;
  }

  public toString() {
    const ex = {
      message: this.message,
      details: this.details,
      stack: this.stack,
    };

    return JSON.stringify(ex);
  }
}
