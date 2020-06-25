import { Layer } from './layer';
import { Constructable } from '../types';
import { LayerManager } from '../layer.manager';
import { AbstractMiddleware } from '../middlewares';

export class MiddlewareLayer extends Layer<AbstractMiddleware> {
  private readonly _layerManager: LayerManager;

  constructor(layerManager: LayerManager) {
    super();
    this._layerManager = layerManager;
  }

  public add(middlewareConstructor: Constructable<AbstractMiddleware>) {
    super.add(middlewareConstructor, this._layerManager);
  }

  public async start() {
    const promises: Array<Promise<void> | void> = [];

    for (const service of this.listAll()) {
      promises.push(service.start());
    }

    await Promise.all(promises);
  }

  public async stop() {
    const promises: Array<Promise<void> | void> = [];

    for (const service of this.listAll()) {
      promises.push(service.stop());
    }

    await Promise.all(promises);
  }
}
