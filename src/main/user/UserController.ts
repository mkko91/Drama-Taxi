import * as _ from 'lodash';
import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import {
  ApiModelProperty,
  ApiUseTags,
  ApiResponse,
} from '@nestjs/swagger';

import { AccountAlreadyExistError, UnKnownUserTypeError } from '../error/error.messages';
import { UserType } from './User';
import { UserRepository, UserSaveData } from './UserRepository';
import { HashPolicy } from '../policy/HashPolicy';


export class PostSignUpUserBody {
  @ApiModelProperty({required: true, enum: ['customer', 'driver']})
  readonly userType: string;

  @ApiModelProperty({required: true})
  readonly email: string;

  @ApiModelProperty({required: true})
  readonly password: string;

  constructor(
    userType,
    email,
    password
  ) {
    this.userType = userType;
    this.email = email;
    this.password = password;
  }
}

export class UserViewModel {
  constructor(
    readonly id: string,
    readonly userType: string,
    readonly email: string
  ) {
  }
}

@ApiUseTags('User')
@Controller()
export class UserController {
  constructor(
    readonly userRepository: UserRepository,
    readonly hashPolicy: HashPolicy
  ) {
  }

  @ApiResponse({status: 200, description: '회원가입(userType, email, password 필요)'})
  @HttpCode(200)
  @Post('/users')
  async signUpUser(@Body() body: PostSignUpUserBody): Promise<UserViewModel> {
    const foundUser = await this.userRepository.findByEmail(body.email);

    if (!_.isNil(foundUser)) {
      throw new AccountAlreadyExistError();
    }

    const hashPassword = await this.hashPolicy.hash(body.password);

    const user = await this.userRepository.save(
      new UserSaveData(
        this.getUserType(body.userType),
        body.email,
        hashPassword
      ));

    return new UserViewModel(
      user.id!,
      user.type,
      user.email
    );
  }

  private getUserType(userType: string): UserType {
    if (userType === UserType.Customer) {
      return UserType.Customer;
    } else if (userType === UserType.Driver) {
      return UserType.Driver;
    } else {
      throw new UnKnownUserTypeError();
    }
  }
}
