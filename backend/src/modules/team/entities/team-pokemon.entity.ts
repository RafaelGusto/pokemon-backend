import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { Team } from './team.entity';
import { Pokemon } from '../../pokemon/entities/pokemon.entity';

@Entity('team_pokémons')
@Unique(['team', 'pokemon'])
export class TeamPokemon {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Team, (team) => team.pokémons, { onDelete: 'CASCADE' })
  team: Team;

  @Column({ type: 'varchar' })
  teamId: string;

  @ManyToOne(() => Pokemon, (pokemon) => pokemon.teams, {
    onDelete: 'CASCADE',
    eager: true,
  })
  pokemon: Pokemon;

  @Column({ type: 'varchar' })
  pokemonId: string;

  @Column({ type: 'int', default: 0 })
  order: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
