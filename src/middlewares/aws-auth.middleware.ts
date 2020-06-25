import { NextFunction, Response } from 'express';
import { ChefuRequest } from '../types';
import { Middleware } from './middleware';

export class AwsAuthMiddleware extends Middleware {
  public async attachProjectAndClient(req: ChefuRequest, _res: Response, next: NextFunction) {
    const authLambdaContextStringified = req.apiGateway.event.requestContext.authorizer.context;
    let authLambdaContext;
    if (typeof authLambdaContextStringified === 'string') {
      try {
        authLambdaContext = JSON.parse(authLambdaContextStringified);
      } catch (ex) {
        authLambdaContext = null;
      }
    }

    req.user = authLambdaContext;

    next();
  }
}
