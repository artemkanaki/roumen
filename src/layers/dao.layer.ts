import { Scheme } from '../types';
import { Layer } from './layer';
import { Dao } from '../dao';
import { DbConnectionManager } from '../db-connection.manager';

export class DaoLayer extends Layer<Dao<Scheme>> {
  private readonly _connectionManager: DbConnectionManager;

  constructor(connectionManager: DbConnectionManager) {
    super();

    this._connectionManager = connectionManager;
  }

  public start() {
    const daos = this.listAll();
    for (const dao of daos) {
      dao.setConnection(this._connectionManager);
    }
  }

  public stop() {
    return Promise.resolve();
  }
}
