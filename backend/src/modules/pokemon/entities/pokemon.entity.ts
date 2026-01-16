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
import { ApiProperty } from '@nestjs/swagger';
import { TeamPokemon } from '../../team/entities/team-pokemon.entity';

@Entity('pokemons')
@Index(['externalId'], { unique: true })
export class Pokemon {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174222' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 1 })
  @Column({ type: 'int' })
  externalId: number;

  @ApiProperty({ example: 'Bulbasaur' })
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ApiProperty({ example: ['grass', 'poison'] })
  @Column({ type: 'json' })
  types: string[];

  @ApiProperty({
    example:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
    required: false,
  })
  @Column({ type: 'text', nullable: true })
  sprite: string;

  @ApiProperty({ required: false })
  @Column({ type: 'json', nullable: true })
  pokeApiData: any;

  @ApiProperty()
  @Column({ type: 'datetime' })
  lastSyncedAt: Date;

  @ApiProperty({ type: () => [TeamPokemon] })
  @OneToMany(() => TeamPokemon, (teamPokemon) => teamPokemon.pokemon)
  teams: TeamPokemon[];

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
