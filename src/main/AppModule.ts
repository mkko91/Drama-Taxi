import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { AuthenticationController } from './authentication/AuthenticationController';
import { AuthenticationRepository } from './authentication/AuthenticationRepository';
import { MemoryAuthenticationRepository } from './authentication/MemoryAuthenticationRepository';
import { UserController } from './user/UserController';
import { UserRepository } from './user/UserRepository';
import { MemoryUserRepository } from './user/MemoryUserRepository';
import { HashPolicy } from './policy/HashPolicy';
import { Sha256HashPolicy } from './policy/Sha256HashPolicy';
import { ResponseTransformInterceptor } from './common/ResponseTransformInterceptor';
import { DriveController } from './drive/DriveController';
import { DriveRepository } from './drive/DriveRepository';
import { MemoryDriveRepository } from './drive/MemoryDriveRepository';

@Module({
  imports: [],
  controllers: [UserController, AuthenticationController, DriveController],
  providers: [{
    provide: UserRepository,
    useClass: MemoryUserRepository
  }, {
    provide: HashPolicy,
    useClass: Sha256HashPolicy
  }, {
    provide: AuthenticationRepository,
    useClass: MemoryAuthenticationRepository
  }, {
    provide: DriveRepository,
    useClass: MemoryDriveRepository
  }, {
    provide: APP_INTERCEPTOR,
    useClass: ResponseTransformInterceptor
  }]
})

export class AppModule {
}
