import { MultiInstanceService } from './multi-instance.service';
import { LayerManager } from '../layer.manager';

export class Service extends MultiInstanceService {
  protected _layerManager: LayerManager;

  constructor(layerManager: LayerManager) {
    super();

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
