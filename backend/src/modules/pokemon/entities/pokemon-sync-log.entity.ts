import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('pokemon_sync_logs')
export class PokemonSyncLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  externalId: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'datetime' })
  lastSyncedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
