import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { ExerciseFilterDto } from './dto/exercise-filter.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { ExerciseService } from './exercise.service';

@ApiTags('Exercise')
@Controller('exercises')
export class ExerciseController {
  constructor(private readonly exerciseService: ExerciseService) {}

  @Post()
  @ApiOperation({ summary: 'Create an exercise' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() dto: CreateExerciseDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.exerciseService.create(dto, file);
  }

  @Get()
  @ApiOperation({
    summary:
      'Get all exercises (optionally filter by category, level, subCategory)',
  })
  findAll(@Query() filter: ExerciseFilterDto) {
    return this.exerciseService.findAll(filter);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get all categories with their sub-categories' })
  getCategories() {
    return this.exerciseService.getCategories();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an exercise by ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.exerciseService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an exercise' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateExerciseDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.exerciseService.update(id, dto, file);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an exercise' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.exerciseService.remove(id);
  }
}
