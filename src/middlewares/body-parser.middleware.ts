import { Middleware } from './middleware';
import { Handler, Request, Response, NextFunction, json } from 'express';
import { LayerManager } from '../layer.manager';

export class BodyParserMiddleware extends Middleware {
  private readonly _handler: Handler;

  constructor(layerManager: LayerManager) {
    super(layerManager);

    this._handler = json();
  }

  public handle(req: Request, res: Response, next: NextFunction) {
    this._handler(req, res, next);
  }
}
