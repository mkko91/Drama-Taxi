import { User, UserType } from './User';

export class UserSaveData {
  constructor(
    readonly userType: UserType,
    readonly email: string,
    readonly password: string
  ) {}
}

export abstract class UserRepository {
  abstract save(data: UserSaveData): Promise<User>;
  abstract findById(id: string): Promise<User | undefined>;
  abstract findByEmail(email: string): Promise<User | undefined>;
}
