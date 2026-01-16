import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { TeamService } from './team.service';
import { CreateTeamDto } from './dtos/create-team.dto';
import { UpdateTeamDto } from './dtos/update-team.dto';
import { AddPokemonToTeamDto } from './dtos/add-pokemon-to-team.dto';
import { Team } from './entities/team.entity';

@ApiTags('Teams')
@Controller('teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo Time' })
  @ApiResponse({
    status: 201,
    description: 'Time criado com sucesso',
    type: Team,
  })
  async create(@Body(ValidationPipe) createTeamDto: CreateTeamDto) {
    return this.teamService.create(createTeamDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os Times' })
  @ApiQuery({
    name: 'trainerId',
    required: false,
    description: 'Filtrar por ID do Treinador',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de Times',
    type: [Team],
  })
  async findAll(@Query('trainerId') trainerId?: string) {
    return this.teamService.findAll(trainerId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar Time por ID' })
  @ApiParam({ name: 'id', description: 'ID do Time' })
  @ApiResponse({
    status: 200,
    description: 'Time encontrado',
    type: Team,
  })
  async findById(@Param('id') id: string) {
    return this.teamService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar Time' })
  @ApiParam({ name: 'id', description: 'ID do Time' })
  @ApiResponse({
    status: 200,
    description: 'Time atualizado',
    type: Team,
  })
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateTeamDto: UpdateTeamDto,
  ) {
    return this.teamService.update(id, updateTeamDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Deletar Time (Soft Delete)' })
  @ApiParam({ name: 'id', description: 'ID do Time' })
  @ApiResponse({
    status: 204,
    description: 'Time deletado com sucesso',
  })
  async delete(@Param('id') id: string) {
    return this.teamService.delete(id);
  }

  @Post(':id/restore')
  @ApiOperation({ summary: 'Restaurar Time deletado' })
  @ApiParam({ name: 'id', description: 'ID do Time' })
  @ApiResponse({
    status: 200,
    description: 'Time restaurado',
    type: Team,
  })
  async restore(@Param('id') id: string) {
    return this.teamService.restore(id);
  }

  @Get(':id/pokemon')
  @ApiOperation({ summary: 'Listar Pokémons do Time' })
  @ApiParam({ name: 'id', description: 'ID do Time' })
  @ApiResponse({
    status: 200,
    description: 'Lista de Pokémons do Time',
  })
  async getPokemonsInTeam(@Param('id') id: string) {
    return this.teamService.getPokemonsInTeam(id);
  }

  @Post(':id/pokemon')
  @ApiOperation({ summary: 'Adicionar Pokémon ao Time' })
  @ApiParam({ name: 'id', description: 'ID do Time' })
  @ApiResponse({
    status: 200,
    description: 'Pokémon adicionado com sucesso',
    type: Team,
  })
  @ApiResponse({
    status: 400,
    description: 'Time já possui 5 Pokémons ou Pokémon já está no Time',
  })
  async addPokemonToTeam(
    @Param('id') id: string,
    @Body(ValidationPipe) addPokemonDto: AddPokemonToTeamDto,
  ) {
    return this.teamService.addPokemonToTeam(id, addPokemonDto);
  }

  @Delete(':teamId/pokemon/:pokemonId')
  @HttpCode(204)
  @ApiOperation({ summary: 'Remover Pokémon do Time' })
  @ApiParam({ name: 'teamId', description: 'ID do Time' })
  @ApiParam({ name: 'pokemonId', description: 'ID do Pokémon' })
  @ApiResponse({
    status: 204,
    description: 'Pokémon removido com sucesso',
  })
  async removePokemonFromTeam(
    @Param('teamId') teamId: string,
    @Param('pokemonId') pokemonId: string,
  ) {
    return this.teamService.removePokemonFromTeam(teamId, pokemonId);
  }

  @Get('trainer/:trainerId')
  @ApiOperation({ summary: 'Listar Times de um Treinador' })
  @ApiParam({ name: 'trainerId', description: 'ID do Treinador' })
  @ApiResponse({
    status: 200,
    description: 'Times do Treinador',
    type: [Team],
  })
  async getTeamsByTrainer(@Param('trainerId') trainerId: string) {
    return this.teamService.getTeamsByTrainer(trainerId);
  }
}
