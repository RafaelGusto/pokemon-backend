import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import databaseConfig from './config/database.config';
import { validate } from './config/env.validation';
import { TrainerModule } from './modules/trainer/trainer.module';
import { TeamModule } from './modules/team/team.module';
import { PokemonModule } from './modules/pokemon/pokemon.module';
import { CepModule } from './modules/cep/cep.module';
import { PokeApiModule } from './integrations/pokeapi/pokeapi.module';
import { ViaCepModule } from './integrations/viacep/viacep.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
      validate,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const config = configService.get('database');
        if (!config) {
          throw new Error('Database configuration not found');
        }
        return config;
      },
    }),
    TrainerModule,
    TeamModule,
    PokemonModule,
    CepModule,
    PokeApiModule,
    ViaCepModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
