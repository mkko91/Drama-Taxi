import { Authentication, AuthenticationType } from './Authentication';
import { HashPolicy } from '../policy/HashPolicy';

export abstract class AuthenticationRepository {
  abstract findByAccessToken(accessToken: string): Promise<Authentication | undefined>;
  abstract findTokenOrCreateByUserId(
    userId: string,
    userType: AuthenticationType,
    hashPolicy: HashPolicy
  ): Promise<Authentication>;
}
