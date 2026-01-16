import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Trainer } from '../modules/trainer/entities/trainer.entity';
import { Team } from '../modules/team/entities/team.entity';
import { Pokemon } from '../modules/pokemon/entities/pokemon.entity';
import { TeamPokemon } from '../modules/team/entities/team-pokemon.entity';
import { PokemonSyncLog } from '../modules/pokemon/entities/pokemon-sync-log.entity';

export default registerAs(
  'database',
  (): TypeOrmModuleOptions => ({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'pokemon_db',
    entities: [Trainer, Team, Pokemon, TeamPokemon, PokemonSyncLog],
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
    logging: process.env.NODE_ENV === 'development',
  }),
);
