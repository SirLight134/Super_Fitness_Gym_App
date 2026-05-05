import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { MealService } from './food.service';
import { Public } from '../Auth/decorators/public.decorator';
import {
  CreateMealDto,
  MealResponseDto,
  UpdateMealDto,
} from './dto/createMeal.dto';

@ApiTags('Meals')
@Controller('meals')
export class MealController {
  constructor(private readonly mealService: MealService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new Meal ' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 201,
    description: 'Meal created successfully',
    type: MealResponseDto,
  })
  @UseInterceptors(FileInterceptor('video'))
  async create(
    @Body() dto: CreateMealDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.mealService.create(dto, file);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all Meal with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Meals retrieved successfully',
  })
  async findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.mealService.findAll({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get a single meal by ID' })
  @ApiResponse({
    status: 200,
    description: 'Meal found',
    type: MealResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Meal not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.mealService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update meal' })
  @ApiResponse({
    status: 200,
    description: 'Meal updated successfully',
    type: MealResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Meal not found' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('video'))
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateMealDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.mealService.update(id, dto, file);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Permanently delete a Meal' })
  @ApiResponse({ status: 204, description: 'Meal deleted successfully' })
  @ApiResponse({ status: 404, description: 'Meal not found' })
  @ApiOperation({ summary: 'Delete a meal' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.mealService.delete(id);
  }
}
