import { HttpException, HttpStatus } from '@nestjs/common';

export class AccountAlreadyExistError extends HttpException {
  constructor() {
    super({
      name: 'AccountAlreadyExistError',
      message: 'Account is already exist.',
    }, HttpStatus.BAD_REQUEST);
  }
}

export class UnKnownAuthenticationTypeError extends HttpException {
  constructor() {
    super({
      name: 'UnKnownAuthenticationTypeError',
      message: 'AuthenticationType is invalid.',
    }, HttpStatus.BAD_REQUEST);
  }
}

export class UnKnownUserTypeError extends HttpException {
  constructor() {
    super({
      name: 'UnKnownUserTypeError',
      message: 'UserType is invalid.',
    }, HttpStatus.BAD_REQUEST);
  }
}

export class AccountNotExistError extends HttpException {
  constructor() {
    super({
      name: 'AccountNotExistError',
      message: 'Account is not exist.',
    }, HttpStatus.BAD_REQUEST);
  }
}

export class PasswordUnmatchedError extends HttpException {
  constructor() {
    super({
      name: 'PasswordUnmatchedError',
      message: 'Password is not matched.',
    }, HttpStatus.BAD_REQUEST);
  }
}

export class AccessTokenNotExistError extends HttpException {
  constructor() {
    super({
      name: 'AccessTokenNotExistError',
      message: 'Password is not matched.',
    }, HttpStatus.BAD_REQUEST);
  }
}

export class UnKnownDriveStatusError extends HttpException {
  constructor() {
    super({
      name: 'UnKnownDriveStatusError',
      message: 'Drive status is invalid.',
    }, HttpStatus.BAD_REQUEST);
  }
}

export class AddressInvalidError extends HttpException {
  constructor() {
    super({
      name: 'AddressInvalidError',
      message: 'Address must be less than 100.',
    }, HttpStatus.BAD_REQUEST);
  }
}

export class DriveNotExistError extends HttpException {
  constructor() {
    super({
      name: 'DriveNotExistError',
      message: 'Drive is not exist.',
    }, HttpStatus.BAD_REQUEST);
  }
}

export class DriveAlreadyComplete extends HttpException {
  constructor() {
    super({
      name: 'DriveAlreadyComplete',
      message: 'Drive is already complete.',
    }, HttpStatus.BAD_REQUEST);
  }
}
