import * as _ from 'lodash';
import { Body, Controller, Get, HttpCode, Param, Post, Put, ReflectMetadata, UseGuards } from '@nestjs/common';
import { ApiImplicitHeader, ApiImplicitParam, ApiModelProperty, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';

import { RequestAuthorizationGuard } from '../common/RequestAuthorizationGuard';
import { AuthenticationType } from '../authentication/Authentication';
import { DriveStatus } from './Drive';
import { DriveRepository, DriveSaveData } from './DriveRepository';
import { Authorization, AuthorizationEntity } from '../decorator/Authorizaiton.decorator';
import { AddressInvalidError, DriveAlreadyComplete, DriveNotExistError } from '../error/error.messages';

class PostDriveViewModel {
  constructor(
    readonly id: string,
    readonly status: DriveStatus,
    readonly requestId: string,
    readonly requestAt: string,
    readonly address: string
  ) {
  }
}

class GetDriveViewModel {
  constructor(
    readonly id: string,
    readonly status: DriveStatus,
    readonly requestId: string,
    readonly requestAt: string,
    readonly responseId: string | undefined,
    readonly responseAt: string | undefined,
    readonly address: string
  ) {
  }
}

class GetDriveViewModels {
  constructor(
    readonly driveViewModels: GetDriveViewModel[],
  ) {
  }
}

class PutDriveViewModel {
  constructor(
    readonly id: string,
    readonly status: DriveStatus,
    readonly requestId: string,
    readonly requestAt: string,
    readonly responseId: string,
    readonly responseAt: string,
    readonly address: string
  ) {
  }
}

class PostDriveBody {
  @ApiModelProperty({required: true, maxLength: 100})
  readonly address: string;

  constructor(
    address
  ) {
    this.address = address;
  }
}

class PutDriveParams {
  @IsNumberString()
  driveId: string = '';
}

@ApiUseTags('Drive(배차 API)')
@Controller()
export class DriveController {
  constructor(
    private readonly driveRepository: DriveRepository
  ) {
  }

  @ApiResponse({status: 200, description: '배차 요청 등록(승객)'})
  @ApiImplicitHeader({name: 'authorization', required: true})
  @HttpCode(200)
  @Post('/drives')
  @ReflectMetadata('authorizationTypes', [AuthenticationType.Customer])
  @UseGuards(RequestAuthorizationGuard)
  async requestDrive(
    @Body() body: PostDriveBody,
    @Authorization() authorization: AuthorizationEntity
  ): Promise<PostDriveViewModel> {
    this.validateAddress(body);

    const newDrive = await this.driveRepository.requestDrive(
      new DriveSaveData(
        authorization.id,
        body.address
      )
    );

    return new PostDriveViewModel(
      newDrive.id!,
      newDrive.status,
      newDrive.requestId,
      newDrive.requestAt.toISOString(),
      newDrive.address
    );
  }

  @ApiResponse({status: 200, description: '배차 요청 목록(승객, 기사)/status(0: 대기중, 1: 완료)'})
  @ApiImplicitHeader({name: 'authorization', required: true})
  @HttpCode(200)
  @Get('/drives')
  @ReflectMetadata('authorizationTypes', [AuthenticationType.Customer, AuthenticationType.Driver])
  @UseGuards(RequestAuthorizationGuard)
  async getDrives(): Promise<GetDriveViewModels> {
    const drives = await this.driveRepository.getDrives();

    const driveViewModels = _.map(drives, (drive) => {
      return new GetDriveViewModel(
        drive.id!,
        drive.status,
        drive.requestId,
        drive.requestAt.toISOString(),
        _.isNil(drive.responseId) ? undefined : drive.responseId,
        _.isNil(drive.responseAt) ? undefined : drive.responseAt.toISOString(),
        drive.address
      );
    });

    return new GetDriveViewModels(driveViewModels);
  }

  @ApiResponse({status: 200, description: '배차 응답(기사)'})
  @ApiImplicitHeader({name: 'authorization', required: true})
  @ApiImplicitParam({name: 'driveId', required: true})
  @HttpCode(200)
  @Put('/drives/:driveId/response')
  @ReflectMetadata('authorizationTypes', [AuthenticationType.Driver])
  @UseGuards(RequestAuthorizationGuard)
  async responseDrive(
    @Param() params: PutDriveParams,
    @Authorization() authorization: AuthorizationEntity
  ): Promise<PutDriveViewModel> {
    const drive = await this.driveRepository.getDrive(params.driveId);

    if (_.isNil(drive)) {
      throw new DriveNotExistError();
    }

    if (drive!.status === DriveStatus.Complete) {
      throw new DriveAlreadyComplete();
    }

    const newDrive = await this.driveRepository.responseDrive(params.driveId, authorization.id);

    return new PutDriveViewModel(
      newDrive.id!,
      newDrive.status,
      newDrive.requestId,
      newDrive.requestAt.toISOString(),
      newDrive.requestId,
      newDrive.requestAt.toISOString(),
      newDrive.address
    );
  }

  private validateAddress(body: PostDriveBody) {
    if (body.address.length > 100) {
      throw new AddressInvalidError();
    }
  }
}
