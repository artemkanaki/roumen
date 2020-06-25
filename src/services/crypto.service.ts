import { createHash } from 'crypto';
import { Service } from './service';

export class CryptoService extends Service {
  public generateHash(input: string) {
    return createHash('sha256').update(input).digest('hex');
  }

  public generateHashWithSalt(input: string, salt: string) {
    return createHash('sha256').update(input).update(salt).digest('hex');
  }
}
