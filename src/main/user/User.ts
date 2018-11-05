export enum UserType {
  Customer = 'customer',
  Driver = 'driver'
}

export class User {
  id?: string;

  constructor(
    readonly type: UserType,
    readonly email: string,
    readonly password: string
  ) {}
}
