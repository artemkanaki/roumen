import { Middleware } from './middleware';
import { Handler, NextFunction, Request, Response } from 'express';
import { LayerManager } from '../layer.manager';
import { eventContext } from 'aws-serverless-express/middleware';

export class AwsEventContextMiddleware extends Middleware {
  private readonly _handler: Handler;

  constructor(layerManager: LayerManager) {
    super(layerManager);

    this._handler = eventContext();
  }

  public handle(req: Request, res: Response, next: NextFunction) {
    this._handler(req, res, next);
  }
}
