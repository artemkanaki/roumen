import {
  Collection,
  FilterQuery,
  UpdateQuery,
  ObjectID,
  FindOneOptions,
  MongoCountPreferences,
  MongoClient,
  ClientSession,
} from 'mongodb';
import { Scheme, DbRequestOptions } from '../types';
import { Dao } from './dao';
import { DbError } from '../errors';
import { DbConnectionManager } from '../db-connection.manager';

enum ParsingDirection {
  toDb = 'toDb',
  fromDb = 'fromDb',
}

export abstract class MongodbDao<MongoScheme extends Scheme> extends Dao<MongoScheme> {
  private _collection: Collection<MongoScheme>;
  private _connection: MongoClient;

  public setConnection(connectionManager: DbConnectionManager) {
    this._connection = connectionManager.getConnection();
    this._collection = connectionManager.getDb().collection<MongoScheme>(this.getCollectionName());
  }

  public async executeTransaction<T>(func: (session: ClientSession) => Promise<T>): Promise<T> {
    const session = this._connection.startSession();
    try {
      session.startTransaction();
      const result = await func(session);
      await session.commitTransaction();
      session.endSession();

      return result;
    } catch (ex) {
      await session.abortTransaction();
      session.endSession();
      throw ex;
    }
  }

  public async create(data: Partial<MongoScheme>, _options?: DbRequestOptions<MongoScheme>): Promise<MongoScheme> {
    const parsedData = this._parse(data, ParsingDirection.toDb);

    try {
      const result = await this._collection.insertOne(parsedData);

      return this._parse(result.ops[0], ParsingDirection.fromDb);
    } catch (ex) {
      throw new DbError(ex);
    }
  }

  public async fill(
    data: Array<Partial<MongoScheme>>,
    _options?: DbRequestOptions<MongoScheme>,
  ): Promise<Array<MongoScheme>> {
    const parsedData = this._parse(data, ParsingDirection.toDb);

    try {
      const result = await this._collection.insertMany(parsedData);

      return this._parse(result.ops, ParsingDirection.fromDb);
    } catch (ex) {
      throw new DbError(ex);
    }
  }

  public async get(query: FilterQuery<MongoScheme>, options: DbRequestOptions = {}): Promise<MongoScheme> {
    const mongoOptions = this._convertOptionsToMongoCompatible(options);
    const parsedQuery = this._parse(query, ParsingDirection.toDb);

    try {
      const result = await this._collection.findOne(parsedQuery, mongoOptions);

      return this._parse(result, ParsingDirection.fromDb);
    } catch (ex) {
      throw new DbError(ex);
    }
  }

  public async list(query: FilterQuery<MongoScheme>, options: DbRequestOptions = {}): Promise<Array<MongoScheme>> {
    const mongoOptions = this._convertOptionsToMongoCompatible(options);
    const parsedQuery = this._parse(query, ParsingDirection.toDb);

    try {
      const cursor = this._collection.find(parsedQuery, mongoOptions);
      if (options.rowsProcessor) {
        let scheme;
        do {
          scheme = await cursor.next();
          if (scheme !== null) {
            const parsed = this._parse(scheme, ParsingDirection.fromDb);
            await options.rowsProcessor(parsed);
          }
        } while (scheme);
      } else {
        const result = await cursor.toArray();
        return this._parse(result, ParsingDirection.fromDb);
      }
    } catch (ex) {
      throw new DbError(ex);
    }
  }

  public async listAll(options: DbRequestOptions<MongoScheme>) {
    try {
      return await this.list({}, options);
    } catch (ex) {
      throw new DbError(ex);
    }
  }

  public async aggregate<T = MongoScheme>(pipeline: Array<object>, options: DbRequestOptions = {}): Promise<Array<T>> {
    if (options.sort) {
      pipeline.push({
        $sort: options.sort,
      });
    }

    if (options.skip) {
      pipeline.push({
        $skip: options.skip,
      });
    }

    if (options.limit) {
      pipeline.push({
        $limit: options.limit,
      });
    }

    const parsedPipeline = this._parse(pipeline, ParsingDirection.toDb);

    try {
      const cursor = this._collection.aggregate(parsedPipeline);
      if (options.rowsProcessor instanceof Function) {
        let scheme;
        do {
          scheme = await cursor.next();
          if (scheme !== null) {
            const parsed = this._parse(scheme, ParsingDirection.fromDb);
            await options.rowsProcessor(parsed);
          }
        } while (scheme);
      } else {
        const result = await cursor.toArray();
        return this._parse(result, ParsingDirection.fromDb);
      }
    } catch (ex) {
      throw new DbError(ex);
    }
  }

  public async count(query: FilterQuery<MongoScheme> = {}, options: MongoCountPreferences = {}): Promise<number> {
    const parsedQuery = this._parse(query, ParsingDirection.toDb);

    try {
      const result = await this._collection.count(parsedQuery, options);

      return result;
    } catch (ex) {
      throw new DbError(ex);
    }
  }

  public async update(
    query: FilterQuery<MongoScheme>,
    updateQuery: Partial<MongoScheme> | UpdateQuery<MongoScheme>,
    _options?: DbRequestOptions<MongoScheme>,
  ): Promise<void> {
    const parsedQuery = this._parse(query, ParsingDirection.toDb);
    const parsedUpdateQuery = this._parse(updateQuery, ParsingDirection.toDb);
    try {
      await this._collection.updateMany(parsedQuery, parsedUpdateQuery);
    } catch (ex) {
      throw new DbError(ex);
    }
  }

  public async delete(query: FilterQuery<MongoScheme>, _options?: DbRequestOptions<MongoScheme>): Promise<void> {
    const parsedQuery = this._parse(query, ParsingDirection.toDb);

    try {
      await this._collection.deleteMany(parsedQuery);
    } catch (ex) {
      throw new DbError(ex);
    }
  }

  public async deleteAll(_options?: DbRequestOptions<MongoScheme>): Promise<void> {
    try {
      await this.delete({});
    } catch (ex) {
      throw new DbError(ex);
    }
  }

  protected _parse(data: any, direction: ParsingDirection): any {
    if (typeof data === 'string' && /^[0-9a-f]{24}$/.test(data) && direction === ParsingDirection.toDb) {
      return new ObjectID(data);
    } else if (
      data &&
      data.constructor &&
      data.constructor.name === 'ObjectID' &&
      direction === ParsingDirection.fromDb
    ) {
      return data.toHexString();
    } else if (data instanceof Array) {
      return data.map((item) => this._parse(item, direction));
    } else if (data instanceof Date) {
      return data;
    } else if (typeof data === 'object' && data !== null) {
      return Object.keys(data).reduce((converted: any, key) => {
        converted[key] = this._parse(data[key], direction);
        return converted;
      }, {});
    }

    return data;
  }

  private _convertOptionsToMongoCompatible(options: DbRequestOptions) {
    const mongoCompatibleOptions: FindOneOptions = {};

    if (options.limit) {
      mongoCompatibleOptions.limit = options.limit;
    }
    if (options.limit) {
      mongoCompatibleOptions.skip = options.skip;
    }
    if (options.limit) {
      mongoCompatibleOptions.sort = options.sort;
    }
    if (options.project) {
      mongoCompatibleOptions.projection = Object.entries(options.project).reduce((projection, [key, value]) => {
        projection[key] = value ? 1 : 0;
        return projection;
      }, {});
    }

    return mongoCompatibleOptions;
  }
}
