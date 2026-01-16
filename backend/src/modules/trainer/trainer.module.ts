import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trainer } from './entities/trainer.entity';
import { TrainerService } from './trainer.service';
import { TrainerController } from './trainer.controller';
import { ViaCepModule } from '../../integrations/viacep/viacep.module';

@Module({
  imports: [TypeOrmModule.forFeature([Trainer]), ViaCepModule],
  controllers: [TrainerController],
  providers: [TrainerService],
  exports: [TrainerService],
})
export class TrainerModule {}
