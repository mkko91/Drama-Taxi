import * as crypto from 'crypto';

import { HashPolicy } from './HashPolicy';

export class Sha256HashPolicy extends HashPolicy {
  async hash(plain: string): Promise<string> {
    const hash = crypto.createHash('sha256');
    hash.update(plain);
    return hash.digest('hex');
  }
}
