import { EmailOpts, EmailConfig } from '../types';
import { promisify } from 'util';
import { createTransport } from 'nodemailer';
import { RetryExecutor } from './retry.executor';
import { LoggerService } from './logger.service';
import { Service } from './service';
import { LayerManager } from '../layer.manager';
import * as config from 'config';

export class EmailService extends Service {
  private readonly _transporter: any;
  private readonly _retryExecutor: RetryExecutor;
  private _logger: LoggerService;

  constructor(layerManager: LayerManager) {
    super(layerManager);

    const emailConfig = config.get<EmailConfig>('emailService');
    this._transporter = createTransport(emailConfig.transport);
    this._retryExecutor = new RetryExecutor(emailConfig.retryExecutor, this._logger);
  }

  protected _init() {
    this._logger = this._layerManager.getService(LoggerService);
  }

  public sendMailOnNextTick(emailOpts: EmailOpts, retryOnError: boolean = true): void {
    process.nextTick(async () => {
      try {
        await this.sendEmail(emailOpts, retryOnError);

        this._logger.info('EmailVerificationService.sendMailOnNextTick: Email sent successfully.');
      } catch (ex) {
        this._logger.error('EmailVerificationService.sendMailOnNextTick: Cant send email.', { ex: JSON.stringify(ex) });
      }
    });
  }

  public sendEmail(emailOpts: EmailOpts, retryOnError: boolean = true): Promise<void> {
    const mailOpts = {
      from: emailOpts.from,
      to: emailOpts.to,

      bcc: emailOpts.bcc,
      cc: emailOpts.cc,

      subject: emailOpts.subject,

      html: emailOpts.body.HTMLBody,
      text: emailOpts.body.textBody,

      inReplyTo: emailOpts.inReplyTo,
      replyTo: emailOpts.replyTo,

      attachments: emailOpts.attachments,
      messageId: emailOpts.messageId,
    };

    const sendMail = promisify(this._transporter.sendMail).bind(this._transporter, mailOpts);

    if (retryOnError) {
      return this._retryExecutor.retry(sendMail);
    } else {
      return sendMail();
    }
  }
}
