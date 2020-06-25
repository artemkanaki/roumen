import { Layer } from './layer';
import { Constructable } from '../types';
import { LayerManager } from '../layer.manager';
import { Controller } from '../controller';

export class ControllerLayer extends Layer<Controller> {
  private readonly _layerManager: LayerManager;

  constructor(layerManager: LayerManager) {
    super();
    this._layerManager = layerManager;
  }

  public add(controllerConstructor: Constructable<Controller>) {
    super.add(controllerConstructor, this._layerManager);
  }

  public async start() {
    const promises: Array<Promise<void> | void> = [];

    for (const controller of this.listAll()) {
      promises.push(controller.start());
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
