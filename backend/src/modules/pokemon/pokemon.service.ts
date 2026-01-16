import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Pokemon } from './entities/pokemon.entity';
import { PokemonSyncLog } from './entities/pokemon-sync-log.entity';
import { PokeApiService } from '../../integrations/pokeapi/pokeapi.service';
import { CreatePokemonDto } from './dtos/create-pokemon.dto';

@Injectable()
export class PokemonService {
  private readonly logger = new Logger(PokemonService.name);
  private readonly ttlDays = parseInt(
    process.env.POKEMON_SYNC_TTL_DAYS || '7',
    10,
  );

  constructor(
    @InjectRepository(Pokemon)
    private readonly pokemonRepository: Repository<Pokemon>,
    @InjectRepository(PokemonSyncLog)
    private readonly syncLogRepository: Repository<PokemonSyncLog>,
    private readonly pokeApiService: PokeApiService,
  ) {}

  async getOrFetchPokemon(externalId: number, forceSync: boolean = false) {
    const existingPokemon = await this.pokemonRepository.findOne({
      where: { externalId },
    });

    const now = new Date();
    const ttlDate = new Date(
      now.getTime() - this.ttlDays * 24 * 60 * 60 * 1000,
    );

    if (
      existingPokemon &&
      existingPokemon.lastSyncedAt > ttlDate &&
      !forceSync
    ) {
      this.logger.debug(`Retornando Pokémon ${externalId} do cache local`);
      return existingPokemon;
    }

    this.logger.debug(`Buscando Pokémon ${externalId} da PokéAPI`);
    const pokeApiData = await this.pokeApiService.fetchPokemonById(externalId);

    if (existingPokemon) {
      existingPokemon.name = pokeApiData.name;
      existingPokemon.types = pokeApiData.types;
      existingPokemon.sprite = pokeApiData.sprite;
      existingPokemon.pokeApiData = pokeApiData.pokeApiData;
      existingPokemon.lastSyncedAt = now;
      return this.pokemonRepository.save(existingPokemon);
    }

    const newPokemon = this.pokemonRepository.create({
      ...pokeApiData,
      lastSyncedAt: now,
    });

    return this.pokemonRepository.save(newPokemon);
  }

  async findAll(
    limit: number = 20,
    offset: number = 0,
  ): Promise<{ data: Pokemon[]; total: number }> {
    const [data, total] = await this.pokemonRepository.findAndCount({
      take: limit,
      skip: offset,
      order: { name: 'ASC' },
    });

    return { data, total };
  }

  async findById(id: string): Promise<Pokemon> {
    const pokemon = await this.pokemonRepository.findOne({
      where: { id },
    });

    if (!pokemon) {
      throw new NotFoundException(`Pokémon ${id} não encontrado`);
    }

    return pokemon;
  }

  async findByExternalId(externalId: number): Promise<Pokemon> {
    const pokemon = await this.pokemonRepository.findOne({
      where: { externalId },
    });

    if (!pokemon) {
      throw new NotFoundException(
        `Pokémon com ID externo ${externalId} não encontrado`,
      );
    }

    return pokemon;
  }

  async syncExpiredPokemon(): Promise<number> {
    const now = new Date();
    const ttlDate = new Date(
      now.getTime() - this.ttlDays * 24 * 60 * 60 * 1000,
    );

    const expiredPokemon = await this.pokemonRepository.find({
      where: {
        lastSyncedAt: LessThan(ttlDate),
      },
    });

    this.logger.debug(
      `Encontrados ${expiredPokemon.length} Pokémons com sincronização expirada`,
    );

    for (const pokemon of expiredPokemon) {
      try {
        await this.getOrFetchPokemon(pokemon.externalId, true);
      } catch (error) {
        this.logger.error(
          `Erro ao sincronizar Pokémon ${pokemon.externalId}:`,
          error.message,
        );
      }
    }

    return expiredPokemon.length;
  }

  async create(createPokemonDto: CreatePokemonDto): Promise<Pokemon> {
    const existingPokemon = await this.pokemonRepository.findOne({
      where: { externalId: createPokemonDto.externalId },
    });

    if (existingPokemon) {
      throw new ConflictException(
        `Pokémon com ID externo ${createPokemonDto.externalId} já existe`,
      );
    }

    if (!createPokemonDto.name || !createPokemonDto.types) {
      return this.getOrFetchPokemon(createPokemonDto.externalId);
    }

    const pokemon = this.pokemonRepository.create({
      ...createPokemonDto,
      lastSyncedAt: new Date(),
    });

    return this.pokemonRepository.save(pokemon);
  }

  async getSyncStatus(): Promise<{
    totalPokemon: number;
    needsSync: number;
    lastSyncDate: Date | null;
  }> {
    const total = await this.pokemonRepository.count();
    const now = new Date();
    const ttlDate = new Date(
      now.getTime() - this.ttlDays * 24 * 60 * 60 * 1000,
    );

    const needsSync = await this.pokemonRepository.count({
      where: {
        lastSyncedAt: LessThan(ttlDate),
      },
    });

    const lastSync = await this.pokemonRepository.findOne({
      where: {},
      order: { lastSyncedAt: 'DESC' },
    });

    return {
      totalPokemon: total,
      needsSync,
      lastSyncDate: lastSync?.lastSyncedAt || null,
    };
  }
}
