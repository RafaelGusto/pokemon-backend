import { Injectable } from '@nestjs/common';
import { ViaCepService } from '../../integrations/viacep/viacep.service';
import { CepResponse } from '../../integrations/viacep/viacep.service';

@Injectable()
export class CepService {
  constructor(private readonly viaCepService: ViaCepService) {}

  async getAddressByCep(cep: string): Promise<CepResponse> {
    return this.viaCepService.getAddressByCep(cep);
  }
}
