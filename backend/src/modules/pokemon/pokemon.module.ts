import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pokemon } from './entities/pokemon.entity';
import { PokemonSyncLog } from './entities/pokemon-sync-log.entity';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';
import { PokeApiModule } from '../../integrations/pokeapi/pokeapi.module';

@Module({
  imports: [TypeOrmModule.forFeature([Pokemon, PokemonSyncLog]), PokeApiModule],
  controllers: [PokemonController],
  providers: [PokemonService],
  exports: [PokemonService],
})
export class PokemonModule {}
