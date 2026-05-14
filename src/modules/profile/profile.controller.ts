import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { AuthGuard } from '@nestjs/passport';
import { ProfileResponseDto } from './dto/profile-response.dto';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { UpdateProfileDto } from './dto/update-profile.dto';
import {
  CurrentUser,
  AuthenticatedUser,
} from '../Auth/decorators/current-user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get my profile',
    description: 'Retrieves the authenticated user profile information',
  })
  @ApiOkResponse({
    description: 'Profile retrieved successfully',
    type: ProfileResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'No authentication token provided or invalid/expired token',
  })
  async getMyProfile(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<ProfileResponseDto> {
    const profile = await this.profileService.getProfile(user.id);
    return plainToInstance(ProfileResponseDto, profile);
  }

  @Patch('update-my-profile')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update my profile',
    description: 'Updates the authenticated user profile information',
  })
  @UseInterceptors(FileInterceptor('profilePicture'))
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({
    description: 'Profile updated successfully',
    type: ProfileResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'No authentication token provided or invalid/expired token',
  })
  async updateMyProfile(
    @CurrentUser() user: AuthenticatedUser,
    @Body() updateProfileDto: UpdateProfileDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: '.(jpg|jpeg|png)$' })],
        fileIsRequired: false,
      }),
    )
    file?: Express.Multer.File,
  ): Promise<ProfileResponseDto> {
    const profile = await this.profileService.updateProfile(
      user.id,
      updateProfileDto,
      file,
    );
    return plainToInstance(ProfileResponseDto, profile);
  }
}
