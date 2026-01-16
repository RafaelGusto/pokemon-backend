import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

export interface CepResponse {
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
  erro?: boolean;
}

@Injectable()
export class ViaCepService {
  private readonly logger = new Logger(ViaCepService.name);
  private readonly baseUrl =
    process.env.VIACEP_BASE_URL || 'https://viacep.com.br/ws';

  constructor(private readonly httpService: HttpService) {}

  async getAddressByCep(cep: string): Promise<CepResponse> {
    const cleanCep = cep.replace(/\D/g, '');

    if (cleanCep.length !== 8) {
      throw new HttpException(
        'CEP deve conter 8 dígitos',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/${cleanCep}/json`),
      );

      if (response.data.erro) {
        throw new HttpException(
          `CEP ${cep} não encontrado`,
          HttpStatus.NOT_FOUND,
        );
      }

      return response.data;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(`Erro ao buscar CEP ${cep}:`, error.message);
      throw new HttpException(
        'Erro ao buscar CEP no ViaCEP',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
