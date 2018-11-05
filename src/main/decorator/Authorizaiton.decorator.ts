import { createParamDecorator } from '@nestjs/common';

export class AuthorizationEntity {
  constructor(
    readonly id: string,
    readonly type: string
  ) {}
}

export const Authorization = createParamDecorator((data, req) => {
  return new AuthorizationEntity(
    req.headers.id,
    req.headers.authorizationType
  );
});
