import { ServiceLayer, DaoLayer, MiddlewareLayer, ControllerLayer, RouterLayer } from './layers';
import { Constructable, Scheme } from './types';
import { Dao } from './dao';
import { Service } from './services';
import { DbConnectionManager } from './db-connection.manager';
import { State } from './enum';
import { AbstractMiddleware } from './middlewares';
import { Controller } from './controller';
import { Router } from './router';
import { InvalidStateError } from './errors';

export class LayerManager {
  private _state: State;
  private readonly _dbConnectionManager: DbConnectionManager;

  private readonly _daoLayer: DaoLayer;
  private readonly _serviceLayer: ServiceLayer;
  private readonly _middlewareLayer: MiddlewareLayer;
  private readonly _controllerLayer: ControllerLayer;
  private readonly _routerLayer: RouterLayer;

  constructor(dbConnectionManager?: DbConnectionManager) {
    this._state = State.Stopped;
    this._dbConnectionManager = dbConnectionManager || new DbConnectionManager();
    this._daoLayer = new DaoLayer(this._dbConnectionManager);
    this._serviceLayer = new ServiceLayer(this);
    this._middlewareLayer = new MiddlewareLayer(this);
    this._controllerLayer = new ControllerLayer(this);
    this._routerLayer = new RouterLayer(this);
  }

  public async start() {
    if (this._state !== State.Stopped) {
      throw new InvalidStateError();
    }

    this._state = State.Starting;

    if (this._dbConnectionManager.getState() === State.Stopped) {
      await this._dbConnectionManager.connect();
    }

    await this._daoLayer.start();
    await this._serviceLayer.start();
    await this._middlewareLayer.start();
    await this._controllerLayer.start();
    await this._routerLayer.start();

    this._state = State.Started;
  }

  public async stop() {
    if (this._state !== State.Started) {
      throw new InvalidStateError();
    }

    this._state = State.Stopping;

    await this._routerLayer.stop();
    await this._controllerLayer.stop();
    await this._middlewareLayer.stop();
    await this._serviceLayer.stop();
    await this._daoLayer.stop();

    await this._dbConnectionManager.disconnect();

    this._state = State.Stopped;
  }

  public getState() {
    return this._state;
  }

  public addDao(daoConstructor: Constructable<Dao<Scheme>>) {
    this._daoLayer.add(daoConstructor);
  }

  public getDao<T extends Dao<Scheme>>(daoConstructor: Constructable<T>): T {
    return this._daoLayer.get(daoConstructor);
  }

  public getAllDao() {
    return this._daoLayer.listAll();
  }

  public addService(serviceConstructor: Constructable<Service>) {
    this._serviceLayer.add(serviceConstructor);
  }

  public getService<T extends Service>(serviceConstructor: Constructable<T>) {
    return this._serviceLayer.get(serviceConstructor);
  }

  public getAllServices() {
    return this._serviceLayer.listAll();
  }

  public addMiddleware(middlewareConstructor: Constructable<AbstractMiddleware>) {
    this._middlewareLayer.add(middlewareConstructor);
  }

  public getMiddleware<T extends AbstractMiddleware>(middlewareConstructor: Constructable<T>) {
    return this._middlewareLayer.get(middlewareConstructor);
  }

  public filterMiddlewareByClass<T extends AbstractMiddleware>(middlewareConstructor: Constructable<T>) {
    return this._middlewareLayer.filterByClass(middlewareConstructor);
  }

  public getAllMiddlewares() {
    return this._middlewareLayer.listAll();
  }

  public addController(controllerConstructor: Constructable<Controller>) {
    this._controllerLayer.add(controllerConstructor);
  }

  public getController<T extends Controller>(controllerConstructor: Constructable<T>) {
    return this._controllerLayer.get(controllerConstructor);
  }

  public getAllControllers() {
    return this._controllerLayer.listAll();
  }

  public addRouter(routerConstructor: Constructable<Router>) {
    this._routerLayer.add(routerConstructor);
  }

  public getRouter<T extends Router>(routerConstructor: Constructable<T>) {
    return this._routerLayer.get(routerConstructor);
  }

  public getAllRouters() {
    return this._routerLayer.listAll();
  }

  public getDbConnectionManager() {
    return this._dbConnectionManager;
  }
}
