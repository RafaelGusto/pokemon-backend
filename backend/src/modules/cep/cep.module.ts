import { Module } from '@nestjs/common';
import { CepService } from './cep.service';
import { CepController } from './cep.controller';
import { ViaCepModule } from '../../integrations/viacep/viacep.module';

@Module({
  imports: [ViaCepModule],
  controllers: [CepController],
  providers: [CepService],
  exports: [CepService],
})
export class CepModule {}
