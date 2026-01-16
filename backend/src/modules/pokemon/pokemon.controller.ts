import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { PokemonService } from './pokemon.service';
import { CreatePokemonDto } from './dtos/create-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';

@ApiTags('Pokémon')
@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Get()
  @ApiOperation({ summary: 'Listar Pokémons salvos localmente' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Limite de resultados (padrão: 20)',
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    type: Number,
    description: 'Offset de paginação (padrão: 0)',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de Pokémons',
    type: [Pokemon],
  })
  async findAll(
    @Query('limit', new ValidationPipe({ transform: true }))
    limit: number = 20,
    @Query('offset', new ValidationPipe({ transform: true }))
    offset: number = 0,
  ) {
    return this.pokemonService.findAll(limit, offset);
  }

  @Get('sync-status')
  @ApiOperation({
    summary: 'Ver status de sincronização',
    description: 'Retorna quantos Pokémons precisam de sincronização',
  })
  @ApiResponse({
    status: 200,
    description: 'Status de sincronização',
    schema: {
      example: {
        totalPokemon: 10,
        needsSync: 2,
        lastSyncDate: '2024-01-16T10:30:00Z',
      },
    },
  })
  async getSyncStatus() {
    return this.pokemonService.getSyncStatus();
  }

  @Post('sync-expired')
  @ApiOperation({
    summary: 'Sincronizar Pokémons expirados',
    description:
      'Resincroniza automaticamente todos os Pokémons com TTL expirado',
  })
  @ApiResponse({
    status: 200,
    description: 'Sincronização concluída',
    schema: {
      example: {
        message: '5 Pokémons foram sincronizados',
        count: 5,
      },
    },
  })
  async syncExpired() {
    const synced = await this.pokemonService.syncExpiredPokemon();
    return {
      message: `${synced} Pokémons foram sincronizados`,
      count: synced,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar Pokémon por ID local' })
  @ApiParam({ name: 'id', description: 'ID local do Pokémon' })
  @ApiResponse({
    status: 200,
    description: 'Pokémon encontrado',
    type: Pokemon,
  })
  async findById(@Param('id') id: string) {
    return this.pokemonService.findById(id);
  }

  @Get('external/:externalId')
  @ApiOperation({ summary: 'Buscar Pokémon por ID externo (PokéAPI)' })
  @ApiParam({
    name: 'externalId',
    type: Number,
    description: 'ID do Pokémon na PokéAPI (ex: 1 para Bulbasaur)',
  })
  @ApiResponse({
    status: 200,
    description: 'Pokémon encontrado',
    type: Pokemon,
  })
  async findByExternalId(@Param('externalId') externalId: number) {
    return this.pokemonService.findByExternalId(externalId);
  }

  @Post()
  @ApiOperation({ summary: 'Criar novo Pokémon' })
  @ApiResponse({
    status: 201,
    description: 'Pokémon criado com sucesso',
    type: Pokemon,
  })
  async create(@Body(ValidationPipe) createPokemonDto: CreatePokemonDto) {
    return this.pokemonService.create(createPokemonDto);
  }

  @Post('fetch/:externalId')
  @ApiOperation({
    summary: 'Sincronizar Pokémon da PokéAPI',
    description: 'Busca o Pokémon na PokéAPI e salva localmente se não existir',
  })
  @ApiParam({
    name: 'externalId',
    type: Number,
    description: 'ID do Pokémon na PokéAPI (ex: 25 para Pikachu)',
  })
  @ApiQuery({
    name: 'forceSync',
    required: false,
    type: Boolean,
    description: 'Forçar resincronização mesmo se já existe',
  })
  @ApiResponse({
    status: 200,
    description: 'Pokémon sincronizado com sucesso',
    type: Pokemon,
  })
  async fetchAndCreate(
    @Param('externalId') externalId: number,
    @Query('forceSync') forceSync: boolean = false,
  ) {
    return this.pokemonService.getOrFetchPokemon(externalId, forceSync);
  }
}
