import { Request, Response, NextFunction } from 'express';
import { WebError } from '../errors';
import { AbstractMiddleware } from './abstract.middleware';

export class ErrorMiddleware extends AbstractMiddleware {
  public handle(ex: WebError, _req: Request, res: Response, _next: NextFunction) {
    res.status(ex.status || 500).send({
      message: ex.message,
      details: ex.details,
      stack: ex.stack,
    });
  }
}
