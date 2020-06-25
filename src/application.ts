import { Server, createServer as createHttpServer } from 'http';
import * as express from 'express';
import * as config from 'config';
import { promisify } from 'util';
import { LayerManager } from './layer.manager';
import { State } from './enum';
import { Middleware, ErrorMiddleware } from './middlewares';
import { Router } from './router';
import { InvalidStateError } from './errors';
import { Constructable } from './types';
import { proxy, createServer as createLambdaServer } from 'aws-serverless-express';

export abstract class Application {
  private _state: State;
  private _serverInstance: Server;
  protected readonly _layerManager: LayerManager;
  private readonly _middlewares: Array<Middleware>;
  private readonly _errorMiddlewares: Array<ErrorMiddleware>;

  constructor() {
    this._state = State.Stopped;
    this._layerManager = new LayerManager();
    this._middlewares = [];
    this._errorMiddlewares = [];

    this._init();
  }

  public get layerManager() {
    return this._layerManager;
  }

  public buildExpressApp(): express.Application {
    const app = express();

    for (const middleware of this._middlewares) {
      app.use(middleware.handle.bind(middleware));
    }

    for (const router of this._layerManager.getAllRouters()) {
      app.use(router.getUrlPrefix(), router.getExpressRouter());
    }

    for (const middleware of this._errorMiddlewares) {
      app.use(middleware.handle.bind(middleware));
    }

    return app;
  }

  public async createServerInstance(awsLambdaBuild: boolean) {
    if (this._serverInstance) {
      return this._serverInstance;
    }

    if (this._layerManager.getState() === State.Stopped) {
      await this._layerManager.start();
    }

    const app = this.buildExpressApp();
    this._serverInstance = awsLambdaBuild ? createLambdaServer(app) : createHttpServer(app);

    return this._serverInstance;
  }

  public async startServer() {
    if (this._state !== State.Stopped) {
      throw new InvalidStateError();
    }

    this._state = State.Starting;

    this.createServerInstance(false);
    await promisify(this._serverInstance.listen).call(this._serverInstance, config.get('server.port'));

    this._state = State.Started;
  }

  public async stopServer() {
    if (this._state !== State.Started) {
      throw new InvalidStateError();
    }

    this._state = State.Stopping;

    const serverInstance = this._serverInstance;
    this._serverInstance = null;

    await promisify(serverInstance.close).bind(this._serverInstance);
    await this._layerManager.stop();

    this._state = State.Stopped;
  }

  public handleAwsRequest(event: any, ctx: any) {
    this.createServerInstance(true).then((serverInstance) => proxy(serverInstance, event, ctx));
  }

  protected abstract _init(): void;

  protected _addMiddleware(middleware: Constructable<Middleware>) {
    this._layerManager.addMiddleware(middleware);
    this._middlewares.push(this._layerManager.getMiddleware(middleware));
  }

  protected _addErrorMiddleware(middleware: Constructable<ErrorMiddleware>) {
    this._layerManager.addMiddleware(middleware);
    this._errorMiddlewares.push(this._layerManager.getMiddleware(middleware));
  }

  protected _addRouter(router: Constructable<Router>) {
    this._layerManager.addRouter(router);
  }
}
