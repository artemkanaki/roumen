import { LayerManager } from './layer.manager';

export class LayerEntity {
  protected _layerManager: LayerManager;

  constructor(layerManager: LayerManager) {
    this._layerManager = layerManager;
  }

  public async start() {
    this._init();
    return Promise.resolve();
  }

  public async stop() {
    return Promise.resolve();
  }

  protected _init() {
    return;
  }
}
