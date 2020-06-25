import { createLogger, transports, format, Logger } from 'winston';
import { Service } from './service';
import { LayerManager } from '../layer.manager';

export class LoggerService extends Service {
  private readonly _logger: Logger;

  constructor(layerManager: LayerManager) {
    super(layerManager);

    this._logger = createLogger({
      level: 'debug',
      transports: [new transports.Console({ format: format.colorize() })],
    });
  }

  public error(message: string, ...meta: Array<any>) {
    this._logger.error(message, meta);
  }

  public warn(message: string, ...meta: Array<any>) {
    this._logger.warn(message, meta);
  }

  public info(message: string, ...meta: Array<any>) {
    this._logger.info(message, meta);
  }

  public debug(message: string, ...meta: Array<any>) {
    this._logger.debug(message, meta);
  }
}
