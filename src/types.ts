import { SupportedLanguages } from './enum';
import { Request } from 'express';

export interface HashMap<T> {
  [key: string]: T;
}

export type Constructable<T> = new (...args: Array<any>) => T;

export interface Scheme {
  _id: string;
}

export interface DbConfig {
  url: string;
  dbName: string;
  config: object;
}

export interface DbRequestOptions<T extends Scheme = Scheme> {
  limit?: number;
  sort?: { [name: string]: 1 | -1 };
  skip?: number;

  rowsProcessor?: (scheme: T) => Promise<void> | void;

  project?: { [key in keyof T]?: boolean };
}

export interface EmailOpts {
  from: string;
  to: string;
  cc?: Array<string>;
  bcc?: Array<string>;
  replyTo?: string;
  inReplyTo?: string;
  messageId?: string;
  headers?: { [key: string]: string };
  subject: string;
  body: EmailBodies;
  attachments?: Array<object>;
}

export interface EmailBodies {
  textBody: string;
  HTMLBody?: string;
}

export interface EmailConfig {
  transport: {
    auth: {
      user: string;
      pass: string;
    };
    host: string;
  };
  retryExecutor: RetryExecutorConfig;
}

export interface RetryExecutorConfig {
  retryCount: number;
  minTimeoutMsec: number;
  maxTimeoutMsec: number;
  factor: number;
  useJitter: boolean;
}

export interface ChefuRequest extends Request {
  user?: {
    id: string;
    login: string;
    lang: SupportedLanguages;
  };
  lang?: SupportedLanguages;
}

export enum HttpMethod {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  PATCH = 'patch',
  DELETE = 'delete',
}
