import { Drive, DriveStatus } from './Drive';

export class DriveSaveData {
  constructor(
    readonly requestId: string,
    readonly address: string
  ) {
  }
}

export abstract class DriveRepository {
  abstract requestDrive(data: DriveSaveData): Promise<Drive>;

  abstract responseDrive(id: string, userId: string): Promise<Drive>;

  abstract getDrive(id: string): Promise<Drive | undefined>;

  abstract getDrives(): Promise<Drive[]>;
}
