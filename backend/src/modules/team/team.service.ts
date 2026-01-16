import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from './entities/team.entity';
import { TeamPokemon } from './entities/team-pokemon.entity';
import { CreateTeamDto } from './dtos/create-team.dto';
import { UpdateTeamDto } from './dtos/update-team.dto';
import { AddPokemonToTeamDto } from './dtos/add-pokemon-to-team.dto';
import { PokemonService } from '../pokemon/pokemon.service';
import { TrainerService } from '../trainer/trainer.service';

@Injectable()
export class TeamService {
  private readonly logger = new Logger(TeamService.name);
  private readonly maxPokemonsPerTeam = 5;

  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    @InjectRepository(TeamPokemon)
    private readonly teamPokemonRepository: Repository<TeamPokemon>,
    private readonly pokemonService: PokemonService,
    private readonly trainerService: TrainerService,
  ) {}

  async create(createTeamDto: CreateTeamDto): Promise<Team> {
    await this.trainerService.findById(createTeamDto.trainerId);

    const team = this.teamRepository.create(createTeamDto);
    return this.teamRepository.save(team);
  }

  async findAll(trainerId?: string): Promise<Team[]> {
    const query = this.teamRepository.createQueryBuilder('team');

    if (trainerId) {
      query.where('team.trainerId = :trainerId', { trainerId });
    }

    return query.leftJoinAndSelect('team.pokemons', 'pokemon').getMany();
  }

  async findById(id: string): Promise<Team> {
    const team = await this.teamRepository.findOne({
      where: { id },
      relations: ['pokemons', 'pokemons.pokemon'],
    });

    if (!team) {
      throw new NotFoundException(`Time ${id} não encontrado`);
    }

    return team;
  }

  async update(id: string, updateTeamDto: UpdateTeamDto): Promise<Team> {
    const team = await this.findById(id);
    Object.assign(team, updateTeamDto);
    return this.teamRepository.save(team);
  }

  async delete(id: string): Promise<void> {
    const team = await this.findById(id);
    await this.teamRepository.softDelete(id);
  }

  async restore(id: string): Promise<Team> {
    await this.teamRepository.restore(id);
    return this.findById(id);
  }

  async addPokemonToTeam(
    teamId: string,
    addPokemonDto: AddPokemonToTeamDto,
  ): Promise<Team> {
    const team = await this.findById(teamId);
    const pokemon = await this.pokemonService.findById(addPokemonDto.pokemonId);

    const currentCount = await this.teamPokemonRepository.count({
      where: { teamId },
    });

    if (currentCount >= this.maxPokemonsPerTeam) {
      throw new BadRequestException(
        `Time já possui ${this.maxPokemonsPerTeam} Pokémons. Máximo atingido.`,
      );
    }

    const existingTeamPokemon = await this.teamPokemonRepository.findOne({
      where: { teamId, pokemonId: pokemon.id },
    });

    if (existingTeamPokemon) {
      throw new ConflictException(`Pokémon ${pokemon.name} já está neste Time`);
    }

    const teamPokemon = this.teamPokemonRepository.create({
      teamId,
      pokemonId: pokemon.id,
      order: currentCount,
    });

    await this.teamPokemonRepository.save(teamPokemon);
    return this.findById(teamId);
  }

  async removePokemonFromTeam(
    teamId: string,
    pokemonId: string,
  ): Promise<Team> {
    const team = await this.findById(teamId);

    const teamPokemon = await this.teamPokemonRepository.findOne({
      where: { teamId, pokemonId },
    });

    if (!teamPokemon) {
      throw new NotFoundException(`Pokémon não encontrado neste Time`);
    }

    await this.teamPokemonRepository.remove(teamPokemon);

    const remaining = await this.teamPokemonRepository.find({
      where: { teamId },
      order: { order: 'ASC' },
    });

    for (let i = 0; i < remaining.length; i++) {
      remaining[i].order = i;
    }

    await this.teamPokemonRepository.save(remaining);

    return this.findById(teamId);
  }

  async getTeamsByTrainer(trainerId: string): Promise<Team[]> {
    await this.trainerService.findById(trainerId);

    return this.teamRepository.find({
      where: { trainerId },
      relations: ['pokemons', 'pokemons.pokemon'],
    });
  }

  async getPokemonsInTeam(teamId: string): Promise<TeamPokemon[]> {
    await this.findById(teamId);

    return this.teamPokemonRepository.find({
      where: { teamId },
      relations: ['pokemon'],
      order: { order: 'ASC' },
    });
  }
}
