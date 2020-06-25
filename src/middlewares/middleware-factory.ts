import { Handler } from 'express';
import { AbstractMiddleware } from './abstract.middleware';

export abstract class MiddlewareFactory extends AbstractMiddleware {
  public abstract generateMiddleware(...args: Array<any>): Handler;
}
