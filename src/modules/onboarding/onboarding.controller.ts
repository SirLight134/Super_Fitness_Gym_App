import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateOnboardingDto } from './dto/create-onboarding.dto';
import { UpdateOnboardingDto } from './dto/update-onboarding.dto';
import { OnboardingService } from './onboarding.service';
import { Public } from '../Auth/decorators/public.decorator';

@ApiTags('Onboarding')
@Controller('onboarding')
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new onboarding screen' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() dto: CreateOnboardingDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.onboardingService.create(dto, file);
  }
  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all onboarding screens' })
  findAll() {
    return this.onboardingService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single screen by ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.onboardingService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update screen' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOnboardingDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.onboardingService.update(id, dto, file);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a screen' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.onboardingService.remove(id);
  }
}
