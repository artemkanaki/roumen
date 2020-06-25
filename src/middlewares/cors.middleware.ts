import { Middleware } from './middleware';
import * as cors from 'cors';
import { Handler, Request, Response, NextFunction } from 'express';
import { LayerManager } from '../layer.manager';

export class CorsMiddleware extends Middleware {
  private readonly _handler: Handler;

  constructor(layerManager: LayerManager) {
    super(layerManager);

    this._handler = cors();
  }

  public handle(req: Request, res: Response, next: NextFunction) {
    this._handler(req, res, next);
  }
}
