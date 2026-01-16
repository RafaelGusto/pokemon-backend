import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Team } from './team.entity';
import { Pokemon } from '../../pokemon/entities/pokemon.entity';

@Entity('team_pokemons')
@Unique(['team', 'pokemon'])
export class TeamPokemon {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174333' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ type: () => Team })
  @ManyToOne(() => Team, (team) => team.pokemons, { onDelete: 'CASCADE' })
  team: Team;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174111' })
  @Column({ type: 'varchar' })
  teamId: string;

  @ApiProperty({ type: () => Pokemon })
  @ManyToOne(() => Pokemon, (pokemon) => pokemon.teams, {
    onDelete: 'CASCADE',
    eager: true,
  })
  pokemon: Pokemon;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174222' })
  @Column({ type: 'varchar' })
  pokemonId: string;

  @ApiProperty({ example: 0 })
  @Column({ type: 'int', default: 0 })
  order: number;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
