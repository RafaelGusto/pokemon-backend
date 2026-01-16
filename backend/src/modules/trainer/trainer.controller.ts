import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
  ValidationPipe,
} from '@nestjs/common';
import { TrainerService } from './trainer.service';
import { CreateTrainerDto } from './dtos/create-trainer.dto';
import { UpdateTrainerDto } from './dtos/update-trainer.dto';

@Controller('trainers')
export class TrainerController {
  constructor(private readonly trainerService: TrainerService) {}

  @Post()
  async create(@Body(ValidationPipe) createTrainerDto: CreateTrainerDto) {
    return this.trainerService.create(createTrainerDto);
  }

  @Get()
  async findAll() {
    return this.trainerService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.trainerService.findById(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateTrainerDto: UpdateTrainerDto,
  ) {
    return this.trainerService.update(id, updateTrainerDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string) {
    return this.trainerService.delete(id);
  }

  @Post(':id/restore')
  async restore(@Param('id') id: string) {
    return this.trainerService.restore(id);
  }

  @Get(':id/address')
  async getAddress(@Param('id') id: string) {
    return this.trainerService.getAddressByCurrentCep(id);
  }

  @Patch(':id/address/:cep')
  async updateAddress(@Param('id') id: string, @Param('cep') cep: string) {
    return this.trainerService.updateAddressFromCep(id, cep);
  }
}
