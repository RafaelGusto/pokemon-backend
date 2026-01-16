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
import { ApiProperty } from '@nestjs/swagger';
import { Trainer } from '../../trainer/entities/trainer.entity';
import { TeamPokemon } from './team-pokemon.entity';

@Entity('teams')
export class Team {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174111' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'Equipe Pikachu' })
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ApiProperty({ type: () => Trainer })
  @ApiProperty({ type: () => Trainer })
  @ManyToOne(() => Trainer, (trainer) => trainer.teams, {
    onDelete: 'CASCADE',
  })
  trainer: Trainer;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @Column({ type: 'varchar' })
  trainerId: string;

  @ApiProperty({ type: () => [TeamPokemon] })
  @OneToMany(() => TeamPokemon, (teamPokemon) => teamPokemon.team, {
    cascade: true,
  })
  pokemons: TeamPokemon[];

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ required: false })
  @DeleteDateColumn()
  deletedAt: Date;
}
