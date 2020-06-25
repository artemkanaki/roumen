import { DbConnectionManager } from '../db-connection.manager';
import { DbRequestOptions, Scheme } from '../types';

export abstract class Dao<T extends Scheme> {
  protected abstract getCollectionName(): string;
  public abstract get(needle: Partial<T>, options?: DbRequestOptions<T>): Promise<T>;
  public abstract list(needle: Partial<T>, options?: DbRequestOptions<T>): Promise<Array<T>>;
  public abstract listAll(options?: DbRequestOptions<T>): Promise<Array<T>>;
  public abstract count(needle?: Partial<T>, options?: DbRequestOptions<T>): Promise<number>;
  public abstract update(needle: Partial<T>, substitution: Partial<T>, options?: DbRequestOptions<T>): Promise<void>;
  public abstract create(needle: Partial<T>, options?: DbRequestOptions<T>): Promise<T>;
  public abstract fill(needle: Array<Partial<T>>, options?: DbRequestOptions<T>): Promise<Array<T>>;
  public abstract delete(needle: Partial<T>, options?: DbRequestOptions<T>): Promise<void>;
  public abstract deleteAll(options?: DbRequestOptions<T>): Promise<void>;
  public abstract setConnection(connectionManager: DbConnectionManager): void;
}
