import { Controller, Get, Param } from '@nestjs/common';
import { CepService } from './cep.service';

@Controller('cep')
export class CepController {
  constructor(private readonly cepService: CepService) {}

  @Get(':cep')
  async getAddressByCep(@Param('cep') cep: string) {
    return this.cepService.getAddressByCep(cep);
  }
}
