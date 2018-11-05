import * as _ from 'lodash';
import { Types } from 'mongoose';

import { User, UserType } from './User';
import { UserRepository, UserSaveData } from './UserRepository';
import UserSchema from './UserSchema';
import { UnKnownUserTypeError } from '../error/error.messages';

export class MemoryUserRepository extends UserRepository {
  async save(data: UserSaveData): Promise<User> {
    const savedUser = await new UserSchema({
      userType: this.getStringFromUserType(data.userType),
      email: data.email,
      password: data.password
    }).save();

    const newUser = this.makeUser(savedUser);

    newUser.id = savedUser._id.toString();

    return newUser;
  }

  async findById(id: string): Promise<User | undefined> {
    const user = await UserSchema.findOne({'_id': Types.ObjectId(id)});

    if (_.isNil(user)) {
      return undefined;
    }

    const foundUser = this.makeUser(user);

    foundUser.id = user._id.toString();

    return foundUser;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const user = await UserSchema.findOne({'email': email});

    if (_.isNil(user)) {
      return undefined;
    }

    const foundUser = this.makeUser(user);

    foundUser.id = user._id.toString();

    return foundUser;
  }

  private getStringFromUserType(userType: UserType): string | UserType {
    if (userType === UserType.Customer) {
      return UserType.Customer;
    } else if (userType === UserType.Driver) {
      return UserType.Driver;
    }

    throw new UnKnownUserTypeError();
  }

  private getUserTypeFromString(userType: string): UserType {
    if (userType === UserType.Customer) {
      return UserType.Customer;
    } else if (userType === UserType.Driver) {
      return UserType.Driver;
    }

    throw new UnKnownUserTypeError();
  }

  private makeUser(user) {
    return new User(
      this.getUserTypeFromString(user.userType),
      user.email,
      user.password
    );
  }
}
