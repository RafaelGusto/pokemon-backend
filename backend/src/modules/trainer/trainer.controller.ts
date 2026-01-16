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
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { TrainerService } from './trainer.service';
import { CreateTrainerDto } from './dtos/create-trainer.dto';
import { UpdateTrainerDto } from './dtos/update-trainer.dto';
import { Trainer } from './entities/trainer.entity';

@ApiTags('Trainers')
@Controller('trainers')
export class TrainerController {
  constructor(private readonly trainerService: TrainerService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo Treinador' })
  @ApiResponse({
    status: 201,
    description: 'Treinador criado com sucesso',
    type: Trainer,
  })
  @ApiResponse({
    status: 409,
    description: 'Email já existe',
  })
  async create(@Body(ValidationPipe) createTrainerDto: CreateTrainerDto) {
    return this.trainerService.create(createTrainerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os Treinadores' })
  @ApiResponse({
    status: 200,
    description: 'Lista de Treinadores',
    type: [Trainer],
  })
  async findAll() {
    return this.trainerService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar Treinador por ID' })
  @ApiParam({ name: 'id', description: 'ID do Treinador' })
  @ApiResponse({
    status: 200,
    description: 'Treinador encontrado',
    type: Trainer,
  })
  @ApiResponse({
    status: 404,
    description: 'Treinador não encontrado',
  })
  async findById(@Param('id') id: string) {
    return this.trainerService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar Treinador' })
  @ApiParam({ name: 'id', description: 'ID do Treinador' })
  @ApiResponse({
    status: 200,
    description: 'Treinador atualizado',
    type: Trainer,
  })
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateTrainerDto: UpdateTrainerDto,
  ) {
    return this.trainerService.update(id, updateTrainerDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Deletar Treinador (Soft Delete)' })
  @ApiParam({ name: 'id', description: 'ID do Treinador' })
  @ApiResponse({
    status: 204,
    description: 'Treinador deletado com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Treinador possui Times ativos',
  })
  async delete(@Param('id') id: string) {
    return this.trainerService.delete(id);
  }

  @Post(':id/restore')
  @ApiOperation({ summary: 'Restaurar Treinador deletado' })
  @ApiParam({ name: 'id', description: 'ID do Treinador' })
  @ApiResponse({
    status: 200,
    description: 'Treinador restaurado',
    type: Trainer,
  })
  async restore(@Param('id') id: string) {
    return this.trainerService.restore(id);
  }

  @Get(':id/address')
  @ApiOperation({ summary: 'Consultar endereço do Treinador via CEP' })
  @ApiParam({ name: 'id', description: 'ID do Treinador' })
  @ApiResponse({
    status: 200,
    description: 'Dados de endereço',
  })
  async getAddress(@Param('id') id: string) {
    return this.trainerService.getAddressByCurrentCep(id);
  }

  @Patch(':id/address/:cep')
  @ApiOperation({ summary: 'Atualizar CEP e endereço do Treinador' })
  @ApiParam({ name: 'id', description: 'ID do Treinador' })
  @ApiParam({ name: 'cep', description: 'CEP (8 dígitos)' })
  @ApiResponse({
    status: 200,
    description: 'Endereço atualizado',
    type: Trainer,
  })
  async updateAddress(@Param('id') id: string, @Param('cep') cep: string) {
    return this.trainerService.updateAddressFromCep(id, cep);
  }
}
