import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PokeApiService {
  private readonly logger = new Logger(PokeApiService.name);
  private readonly baseUrl =
    process.env.POKEAPI_BASE_URL || 'https://pokeapi.co/api/v2';

  constructor(private readonly httpService: HttpService) {}

  async fetchPokemonById(id: number) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/pokemon/${id}`),
      );

      return {
        externalId: response.data.id,
        name: response.data.name,
        types: response.data.types.map((t: any) => t.type.name),
        sprite:
          response.data.sprites?.other?.['official-artwork']?.front_default ||
          response.data.sprites?.front_default,
        pokeApiData: response.data,
      };
    } catch (error) {
      this.logger.error(`Erro ao buscar Pokémon ${id}:`, error.message);
      throw new HttpException(
        `Pokémon com ID ${id} não encontrado na PokéAPI`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async fetchPokemonByName(name: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/pokemon/${name.toLowerCase()}`),
      );

      return {
        externalId: response.data.id,
        name: response.data.name,
        types: response.data.types.map((t: any) => t.type.name),
        sprite:
          response.data.sprites?.other?.['official-artwork']?.front_default ||
          response.data.sprites?.front_default,
        pokeApiData: response.data,
      };
    } catch (error) {
      this.logger.error(`Erro ao buscar Pokémon ${name}:`, error.message);
      throw new HttpException(
        `Pokémon com nome ${name} não encontrado na PokéAPI`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async listAllPokemon(limit: number = 20, offset: number = 0) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `${this.baseUrl}/pokemon?limit=${limit}&offset=${offset}`,
        ),
      );

      return {
        results: response.data.results,
        count: response.data.count,
        next: response.data.next,
        previous: response.data.previous,
      };
    } catch (error) {
      this.logger.error('Erro ao listar Pokémons:', error.message);
      throw new HttpException(
        'Erro ao listar Pokémons da PokéAPI',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
