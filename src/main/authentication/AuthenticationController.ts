import * as _ from 'lodash';
import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiModelProperty, ApiUseTags, ApiResponse } from '@nestjs/swagger';

import { HashPolicy } from '../policy/HashPolicy';
import { AccountNotExistError, PasswordUnmatchedError, UnKnownAuthenticationTypeError } from '../error/error.messages';
import { UserRepository } from '../user/UserRepository';
import { AuthenticationRepository } from './AuthenticationRepository';
import { AuthenticationType } from './Authentication';

export class PostSignInBody {
  @ApiModelProperty({required: true})
  readonly email: string;

  @ApiModelProperty({required: true})
  readonly password: string;

  constructor(email, password) {
    this.email = email;
    this.password = password;
  }
}

export class SignInViewModel {
  constructor(
    readonly accessToken: string,
    readonly accessTokenExpiresIn: string
  ) {
  }
}

@ApiUseTags('Authentication')
@Controller()
export class AuthenticationController {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authenticationRepository: AuthenticationRepository,
    private readonly hashPolicy: HashPolicy
  ) {
  }

  @ApiResponse({status: 200, description: '로그인'})
  @HttpCode(200)
  @Post('/authentications')
  async signIn(@Body() body: PostSignInBody): Promise<SignInViewModel> {
    const user = await this.userRepository.findByEmail(body.email);

    this.checkAccountExist(user);

    const hashPassword = await this.hashPassword(body.password);

    this.checkPassword(user!.password, hashPassword);

    const authentication =
      await this.authenticationRepository.findTokenOrCreateByUserId(
        user!.id!,
        this.getAuthenticationTypeFromUserType(user!.type),
        this.hashPolicy
      );

    return new SignInViewModel(authentication.accessToken, authentication.accessTokenExpiresIn.toISOString());
  }

  private checkAccountExist(account) {
    if (_.isNil(account)) {
      throw new AccountNotExistError();
    }
  }

  private async hashPassword(password: string) {
    return await this.hashPolicy.hash(password);
  }

  private checkPassword(password, hashedPassword) {
    if (!_.isEqual(password, hashedPassword)) {
      throw new PasswordUnmatchedError();
    }
  }

  private getAuthenticationTypeFromUserType(type: string) {
    if (type === AuthenticationType.Driver) {
      return AuthenticationType.Driver;
    } else if (type === AuthenticationType.Customer) {
      return AuthenticationType.Customer;
    }

    throw new UnKnownAuthenticationTypeError();
  }
}
