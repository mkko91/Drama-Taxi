import * as _ from 'lodash';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { UserRepository } from '../user/UserRepository';
import { AuthenticationRepository } from '../authentication/AuthenticationRepository';
import { AuthenticationType } from '../authentication/Authentication';
import { UnKnownAuthenticationTypeError, AccessTokenNotExistError } from '../error/error.messages';

@Injectable()
export class RequestAuthorizationGuard implements CanActivate {
  constructor(
    readonly authenticationRepository: AuthenticationRepository,
    private readonly reflector: Reflector
  ) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorizationTypes =
      this.reflector.get<AuthenticationType[]>('authorizationTypes', context.getHandler());

    return this.validateRequest(request, authorizationTypes);
  }

  private async validateRequest(request: any, authorizationTypes: AuthenticationType[]): Promise<boolean> {
    const authentication = await this.authenticationRepository.findByAccessToken(request.headers.authorization);

    request.headers.authorizationTypes = authorizationTypes;

    if (_.isNil(authentication)) {
      throw new AccessTokenNotExistError();
    }

    if (_.indexOf(authorizationTypes, authentication.userType) < 0) {
      throw new UnKnownAuthenticationTypeError();
    }

    request.headers.id = authentication.userId;
    request.headers.authorizationType = authentication.userType;

    return true;
  }
}
