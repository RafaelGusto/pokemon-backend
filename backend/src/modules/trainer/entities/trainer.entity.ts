import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Team } from '../../team/entities/team.entity';

@Entity('trainers')
export class Trainer {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'trainer@example.com' })
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @ApiProperty({ example: 'Ash Ketchum' })
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ApiProperty({ example: '01310100', required: false })
  @Column({ type: 'varchar', length: 8, nullable: true })
  cep: string;

  @ApiProperty({ required: false })
  @Column({ type: 'json', nullable: true })
  addressData: {
    cep: string;
    logradouro: string;
    numero?: string;
    complemento?: string;
    bairro: string;
    localidade: string;
    uf: string;
    ibge?: string;
    gia?: string;
    ddd?: string;
    siafi?: string;
  };

  @ApiProperty({ type: () => [Team] })
  @OneToMany(() => Team, (team) => team.trainer, { cascade: true })
  teams: Team[];

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
