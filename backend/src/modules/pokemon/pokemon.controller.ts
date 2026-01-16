import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { CreatePokemonDto } from './dtos/create-pokemon.dto';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Get()
  async findAll(
    @Query('limit', new ValidationPipe({ transform: true }))
    limit: number = 20,
    @Query('offset', new ValidationPipe({ transform: true }))
    offset: number = 0,
  ) {
    return this.pokemonService.findAll(limit, offset);
  }

  @Get('sync-status')
  async getSyncStatus() {
    return this.pokemonService.getSyncStatus();
  }

  @Post('sync-expired')
  async syncExpired() {
    const synced = await this.pokemonService.syncExpiredPokemon();
    return {
      message: `${synced} Pokémons foram sincronizados`,
      count: synced,
    };
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.pokemonService.findById(id);
  }

  @Get('external/:externalId')
  async findByExternalId(@Param('externalId') externalId: number) {
    return this.pokemonService.findByExternalId(externalId);
  }

  @Post()
  async create(@Body(ValidationPipe) createPokemonDto: CreatePokemonDto) {
    return this.pokemonService.create(createPokemonDto);
  }

  @Post('fetch/:externalId')
  async fetchAndCreate(
    @Param('externalId') externalId: number,
    @Query('forceSync') forceSync: boolean = false,
  ) {
    return this.pokemonService.getOrFetchPokemon(externalId, forceSync);
  }
}
