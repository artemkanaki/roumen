import { Service } from './service';

export class SecurityService extends Service {
  // NOTICE: prevents timing attacks
  public compareStrings(first: string, second: string) {
    let match = true;

    for (let index = 0; index < first.length; index++) {
      if (first[index] !== second[index]) {
        match = false;
      }
    }

    return match;
  }
}
