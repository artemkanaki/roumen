import { HashMap, Constructable } from '../types';

export class Layer<Entity> {
  private readonly _entitiesMap: HashMap<Entity>;

  constructor() {
    this._entitiesMap = {};
  }

  public add<T extends Entity>(classConstructor: Constructable<T>, ...args: Array<any>): void {
    this._entitiesMap[classConstructor.name] = new classConstructor(...args);
  }

  public get<T extends Entity>(classConstructor: Constructable<T>): T {
    const name = classConstructor.name;
    const instance = this._entitiesMap[name] as T;

    if (!instance) {
      throw new Error(`Entity ${name} is not registered`);
    }

    return instance;
  }

  public filterByClass<T extends Entity>(classConstructor: Constructable<T>): Array<T> {
    const list: Array<T> = [];
    for (const entity of this.listAll()) {
      if (entity instanceof classConstructor) {
        list.push(entity);
      }
    }

    return list;
  }

  public listAll(): Array<Entity> {
    return Object.values(this._entitiesMap);
  }

  public start(): Promise<void> | void {
    return Promise.resolve();
  }

  public stop(): Promise<void> | void {
    return Promise.resolve();
  }
}
