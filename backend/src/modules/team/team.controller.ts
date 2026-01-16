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
import { TeamService } from './team.service';
import { CreateTeamDto } from './dtos/create-team.dto';
import { UpdateTeamDto } from './dtos/update-team.dto';
import { AddPokemonToTeamDto } from './dtos/add-pokemon-to-team.dto';

@Controller('teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post()
  async create(@Body(ValidationPipe) createTeamDto: CreateTeamDto) {
    return this.teamService.create(createTeamDto);
  }

  @Get()
  async findAll(@Query('trainerId') trainerId?: string) {
    return this.teamService.findAll(trainerId);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.teamService.findById(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateTeamDto: UpdateTeamDto,
  ) {
    return this.teamService.update(id, updateTeamDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string) {
    return this.teamService.delete(id);
  }

  @Post(':id/restore')
  async restore(@Param('id') id: string) {
    return this.teamService.restore(id);
  }

  @Get(':id/pokemon')
  async getPokemonsInTeam(@Param('id') id: string) {
    return this.teamService.getPokemonsInTeam(id);
  }

  @Post(':id/pokemon')
  async addPokemonToTeam(
    @Param('id') id: string,
    @Body(ValidationPipe) addPokemonDto: AddPokemonToTeamDto,
  ) {
    return this.teamService.addPokemonToTeam(id, addPokemonDto);
  }

  @Delete(':teamId/pokemon/:pokemonId')
  @HttpCode(204)
  async removePokemonFromTeam(
    @Param('teamId') teamId: string,
    @Param('pokemonId') pokemonId: string,
  ) {
    return this.teamService.removePokemonFromTeam(teamId, pokemonId);
  }

  @Get('trainer/:trainerId')
  async getTeamsByTrainer(@Param('trainerId') trainerId: string) {
    return this.teamService.getTeamsByTrainer(trainerId);
  }
}
