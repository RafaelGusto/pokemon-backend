import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CepService } from './cep.service';

@ApiTags('CEP')
@Controller('cep')
export class CepController {
  constructor(private readonly cepService: CepService) {}

  @Get(':cep')
  @ApiOperation({
    summary: 'Consultar endereço por CEP',
    description: 'Integração com ViaCEP para buscar dados de endereço',
  })
  @ApiParam({
    name: 'cep',
    description: 'CEP sem formatação (8 dígitos, ex: 01310100)',
  })
  @ApiResponse({
    status: 200,
    description: 'Dados de endereço encontrados',
    schema: {
      example: {
        cep: '01310-100',
        logradouro: 'Avenida Paulista',
        numero: '1000',
        bairro: 'Bela Vista',
        localidade: 'São Paulo',
        uf: 'SP',
        ibge: '3550308',
        ddd: '11',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'CEP não encontrado',
  })
  async getAddressByCep(@Param('cep') cep: string) {
    return this.cepService.getAddressByCep(cep);
  }
}
