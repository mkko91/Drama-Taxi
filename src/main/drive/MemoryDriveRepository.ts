import * as _ from 'lodash';
import { Types } from 'mongoose';

import { DriveRepository, DriveSaveData } from './DriveRepository';
import { Drive, DriveStatus } from './Drive';
import DriveSchema from './DriveSchema';
import { UnKnownDriveStatusError } from '../error/error.messages';
import { DateTime } from 'luxon';

export class MemoryDriveRepository extends DriveRepository {
  async requestDrive(data: DriveSaveData): Promise<Drive> {
    const drive = await new DriveSchema({
      requestId: Types.ObjectId(data.requestId),
      requestAt: DateTime.local(),
      status: DriveStatus.Waiting,
      address: data.address,
      responseId: undefined,
      responseAt: undefined
    }).save();

    return this.makeReturnDrive(drive);
  }


  async getDrive(id: string): Promise<Drive | undefined> {
    const drive = await DriveSchema.findOne({'_id': Types.ObjectId(id)});

    return this.makeReturnDrive(drive);
  }

  async getDrives(): Promise<Drive[]> {
    const drives = await DriveSchema.find();

    return _.map(drives, (drive) => this.makeReturnDrive(drive));
  }

  async responseDrive(id: string, userId: string): Promise<Drive> {
    const bodyParams = {
      status: DriveStatus.Complete,
      responseId: Types.ObjectId(userId),
      responseAt: DateTime.local()
    };

    const drive = await DriveSchema.findOneAndUpdate({
      '_id': Types.ObjectId(id)
    }, {
      $set: bodyParams
    });

    console.log(drive);

    return this.makeReturnDrive(drive);
  }

  private getDriveStatusByNumber(status: Number): DriveStatus {
    console.log(status);
    if (status === DriveStatus.Waiting) {
      return DriveStatus.Waiting;
    } else if (status === DriveStatus.Complete) {
      return DriveStatus.Complete;
    }

    throw new UnKnownDriveStatusError();
  }

  private makeReturnDrive(drive) {
    const newDrive = new Drive(
      this.getDriveStatusByNumber(drive.status),
      drive.requestId.toString(),
      drive.requestAt,
      drive.address
    );

    newDrive.id = drive._id.toString();

    return newDrive;
  }
}
