import { State } from './enum';
import * as config from 'config';
import { DbConfig } from './types';
import { MongoClient, Db } from 'mongodb';
import { InvalidStateError } from './errors';

export class DbConnectionManager {
  private _state: State;
  private readonly _dbConfig: DbConfig;
  private _connection: MongoClient;
  private _db: Db;

  constructor(connection?: MongoClient) {
    this._dbConfig = config.get<DbConfig>('dbConnectionManager');

    if (connection) {
      this._state = State.Started;
      this._connection = connection;
      this._db = this._connection.db(this._dbConfig.dbName);
    } else {
      this._state = State.Stopped;
    }
  }

  public getState() {
    return this._state;
  }

  public async connect() {
    if (this._state !== State.Stopped) {
      throw new InvalidStateError();
    }

    this._state = State.Starting;

    this._connection = await MongoClient.connect(this._dbConfig.url, this._dbConfig.config);
    this._db = this._connection.db(this._dbConfig.dbName);

    this._state = State.Started;
  }

  public async disconnect() {
    if (this._state !== State.Started) {
      throw new InvalidStateError();
    }

    this._state = State.Stopping;

    const connection = this._connection;
    this._connection = null;
    this._db = null;
    await connection.close();

    this._state = State.Stopped;
  }

  public getConnection() {
    return this._connection;
  }

  public getDb() {
    return this._db;
  }

  public isConnected() {
    return this._connection.isConnected();
  }
}
