import { Layer } from './layer';
import { Constructable } from '../types';
import { LayerManager } from '../layer.manager';
import { Router } from '../router';

export class RouterLayer extends Layer<Router> {
  private readonly _layerManager: LayerManager;

  constructor(layerManager: LayerManager) {
    super();
    this._layerManager = layerManager;
  }

  public add(routerConstructor: Constructable<Router>) {
    super.add(routerConstructor, this._layerManager);
  }

  public async start() {
    const promises: Array<Promise<void> | void> = [];

    for (const router of this.listAll()) {
      promises.push(router.start());
    }

    await Promise.all(promises);
  }

  public async stop() {
    const promises: Array<Promise<void> | void> = [];

    for (const controller of this.listAll()) {
      promises.push(controller.stop());
    }

    await Promise.all(promises);
  }
}
