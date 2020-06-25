import { NextFunction, Request, Response } from 'express';
import { AbstractMiddleware } from './abstract.middleware';

export class Middleware extends AbstractMiddleware {
  public handle(_req: Request, _res: Response, next: NextFunction): void | Promise<void> {
    next();
  }
}
