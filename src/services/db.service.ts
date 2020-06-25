import { Scheme, DbRequestOptions } from '../types';
import { Service } from './service';
import { Dao } from '../dao';
import { LayerManager } from '../layer.manager';

export class DbService<S extends Scheme, D extends Dao<S>> extends Service {
  protected _dao: D;

  constructor(layerManager: LayerManager, dao: D) {
    super(layerManager);
    this._dao = dao;
  }

  public async fill(data: Array<Partial<S>>): Promise<Array<S>> {
    return this._dao.fill(data);
  }

  public async create(data: Partial<S>): Promise<S> {
    return this._dao.create(data);
  }

  public async deleteAll() {
    await this._dao.deleteAll();
  }

  public listAll(options?: DbRequestOptions<S>): Promise<Array<S>> {
    return this._dao.listAll(options);
  }
}
