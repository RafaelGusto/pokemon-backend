import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from './entities/team.entity';
import { TeamPokemon } from './entities/team-pokemon.entity';
import { TeamService } from './team.service';
import { TeamController } from './team.controller';
import { PokemonModule } from '../pokemon/pokemon.module';
import { TrainerModule } from '../trainer/trainer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Team, TeamPokemon]),
    PokemonModule,
    TrainerModule,
  ],
  controllers: [TeamController],
  providers: [TeamService],
  exports: [TeamService],
})
export class TeamModule {}
