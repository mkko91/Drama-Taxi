import * as _ from 'lodash';
import { DateTime } from 'luxon';
import { Types } from 'mongoose';

import { AuthenticationRepository } from './AuthenticationRepository';
import { Authentication, AuthenticationType } from './Authentication';
import { HashPolicy } from '../policy/HashPolicy';
import AuthenticationSchema from './AuthenticationSchema';
import { UnKnownAuthenticationTypeError } from '../error/error.messages';

export class MemoryAuthenticationRepository extends AuthenticationRepository {
  async findByAccessToken(accessToken: string): Promise<Authentication | undefined> {
    const authentication = await AuthenticationSchema.findOne({'accessToken': accessToken});

    if (_.isNil(authentication)) {
      return undefined;
    }

    const isExpired = DateTime.local().toJSDate().getTime() - authentication!.accessTokenExpiresIn.getTime();

    if (isExpired > 0) {
      return undefined;
    }

    return this.makeReturnAuthentication(authentication);
  }

  async findTokenOrCreateByUserId(
    userId: string,
    userType: AuthenticationType,
    hashPolicy: HashPolicy
  ): Promise<Authentication> {
    const authentication = await this.findAuthenticationByUserId(userId);

    if (_.isNil(authentication) || this.checkIsTokenExpired(authentication.accessTokenExpiresIn.getTime()) > 0) {
      return await this.createNewAuthentication(userId, userType, hashPolicy);

    }

    return authentication;
  }

  private async findAuthenticationByUserId(id: string): Promise<Authentication | undefined> {
    const authentication = await AuthenticationSchema.findOne({'userId': Types.ObjectId(id)});

    if (_.isNil(authentication)) {
      return undefined;
    }

    return this.makeReturnAuthentication(authentication);
  }

  private makeReturnAuthentication(authentication) {
    const foundAuthentication = new Authentication(
      this.getAuthenticationTypeFromString(authentication.userType),
      authentication.accessToken,
      authentication.accessTokenExpiresIn,
    );

    foundAuthentication.userId = authentication.userId.toString();
    foundAuthentication.id = authentication._id.toString();

    return foundAuthentication;
  }

  private async createNewAuthentication(
    id: string,
    type: AuthenticationType,
    hashPolicy: HashPolicy
  ): Promise<Authentication> {
    const accessToken = await this.createNewAccessToken(hashPolicy, id, '60');

    const savedAuthentication = await new AuthenticationSchema({
      userId: Types.ObjectId(id),
      userType: type,
      accessToken: accessToken,
      accessTokenExpiresIn: DateTime.local().plus({hours: 1}).toJSDate()
    }).save();

    return this.makeReturnAuthentication(savedAuthentication);
  }

  private checkIsTokenExpired(tokenExpiresIn) {
    const currentTime = DateTime.local().toJSDate().getTime();
    return currentTime - tokenExpiresIn;
  }

  private async createNewAccessToken(hashPolicy: HashPolicy, key: string, value: string): Promise<string> {
    return await hashPolicy.hash(key + value);
  }

  private getAuthenticationTypeFromString(type: string): AuthenticationType {
    if (type === AuthenticationType.Driver) {
      return AuthenticationType.Driver;
    } else if (type === AuthenticationType.Customer) {
      return AuthenticationType.Customer;
    }

    throw new UnKnownAuthenticationTypeError();
  }
}
