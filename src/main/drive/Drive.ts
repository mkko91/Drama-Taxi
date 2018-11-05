export enum DriveStatus {
  Waiting, Complete
}

export class Drive {
  id?: string;
  responseId?: string;
  responseAt?: Date;

  constructor(
    readonly status: DriveStatus,
    readonly requestId: string,
    readonly requestAt: Date,
    readonly address: string
  ) {}
}
