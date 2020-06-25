import { Layer } from './layer';
import { Service } from '../services';
import { Constructable } from '../types';
import { LayerManager } from '../layer.manager';

export class ServiceLayer extends Layer<Service> {
  private readonly _layerManager: LayerManager;

  constructor(layerManager: LayerManager) {
    super();
    this._layerManager = layerManager;
  }

  public add(serviceConstructor: Constructable<Service>) {
    super.add(serviceConstructor, this._layerManager);
  }

  public async start() {
    const promises: Array<Promise<void> | void> = [];

    for (const middleware of this.listAll()) {
      promises.push(middleware.start());
    }

    await Promise.all(promises);
  }

  public async stop() {
    const promises: Array<Promise<void> | void> = [];

    for (const middleware of this.listAll()) {
      promises.push(middleware.stop());
    }

    await Promise.all(promises);
  }
}
