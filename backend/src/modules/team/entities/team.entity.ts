import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  DeleteDateColumn,
} from 'typeorm';
import { Trainer } from '../../trainer/entities/trainer.entity';
import { TeamPokemon } from './team-pokemon.entity';

@Entity('teams')
export class Team {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ManyToOne(() => Trainer, (trainer) => trainer.teams, {
    onDelete: 'CASCADE',
  })
  trainer: Trainer;

  @Column({ type: 'varchar' })
  trainerId: string;

  @OneToMany(() => TeamPokemon, (teamPokemon) => teamPokemon.team, {
    cascade: true,
  })
  pokémons: TeamPokemon[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
