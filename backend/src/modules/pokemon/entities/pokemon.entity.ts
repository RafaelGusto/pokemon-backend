import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  OneToMany,
  Index,
} from 'typeorm';
import { TeamPokemon } from '../../team/entities/team-pokemon.entity';

@Entity('pokémons')
@Index(['externalId'], { unique: true })
export class Pokemon {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  externalId: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'json' })
  types: string[];

  @Column({ type: 'text', nullable: true })
  sprite: string;

  @Column({ type: 'json', nullable: true })
  pokeApiData: any;

  @Column({ type: 'datetime' })
  lastSyncedAt: Date;

  @OneToMany(() => TeamPokemon, (teamPokemon) => teamPokemon.pokemon)
  teams: TeamPokemon[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
