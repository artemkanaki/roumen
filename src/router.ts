import { Router as ExpressRouter } from 'express';
import { LayerEntity } from './layer.entity';

export abstract class Router extends LayerEntity {
  public abstract getExpressRouter(): ExpressRouter;
  public abstract getUrlPrefix(): string;
}
