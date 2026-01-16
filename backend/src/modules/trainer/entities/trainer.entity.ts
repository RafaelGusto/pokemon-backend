import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { Team } from '../../team/entities/team.entity';

@Entity('trainers')
export class Trainer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 8, nullable: true })
  cep: string;

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

  @OneToMany(() => Team, (team) => team.trainer, { cascade: true })
  teams: Team[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
