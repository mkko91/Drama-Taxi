export enum AuthenticationType {
  Customer = 'customer',
  Driver = 'driver'
}

export class Authentication {
  id?: string;
  userId?: string;

  constructor(
    readonly userType: AuthenticationType,
    readonly accessToken: string,
    readonly accessTokenExpiresIn: Date
  ) {}
}
