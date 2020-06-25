import { RetryExecutorConfig } from '../types';
import { MultiInstanceService } from './multi-instance.service';
import { LoggerService } from './logger.service';

export class RetryExecutor extends MultiInstanceService {
  private readonly _retryCount: number;
  private readonly _minTimeoutMsec: number;
  private readonly _maxTimeoutMsec: number;
  private readonly _factor: number;
  private readonly _useJitter: boolean;
  private readonly _logger: LoggerService;

  constructor(config: RetryExecutorConfig, logger: LoggerService) {
    super();

    this._logger = logger;
    this._retryCount = config.retryCount;
    this._minTimeoutMsec = config.minTimeoutMsec;
    this._maxTimeoutMsec = config.maxTimeoutMsec;
    this._factor = config.factor;
    this._useJitter = config.useJitter;
  }

  public async retry(targetFunction: (...args: Array<any>) => any) {
    for (let iteration = 0; iteration <= this._retryCount; iteration++) {
      try {
        return await targetFunction();
      } catch (ex) {
        this._logger.warn('RetryExecutor.retry: Error occurred during function execution.', { ex });

        if (iteration === this._retryCount) {
          this._logger.error('RetryExecutor.retry: Error will be thrown.');
          throw ex;
        }
      }

      const timeoutMs = this._calculateTimeout(iteration);

      this._logger.debug(`RetryExecutor.retry: Function will be relaunched in ${timeoutMs}ms`);

      await this._timeout(timeoutMs);
    }
  }

  private _timeout(delay: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, delay);
    });
  }

  private _calculateTimeout(seed: number) {
    const randomValue = this._useJitter ? Math.random() + 1 : 1;
    const calculatedTimeout = randomValue * this._minTimeoutMsec * Math.pow(this._factor, seed);
    return Math.min(this._maxTimeoutMsec, calculatedTimeout);
  }
}
