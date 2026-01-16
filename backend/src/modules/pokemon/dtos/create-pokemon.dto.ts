import { IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePokemonDto {
  @ApiProperty({
    example: 1,
    description: 'ID do Pokémon na PokéAPI',
  })
  @IsNumber()
  externalId: number;

  @ApiPropertyOptional({
    example: 'Bulbasaur',
    description: 'Nome do Pokémon',
  })
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    example: ['grass', 'poison'],
    description: 'Tipos do Pokémon',
    isArray: true,
  })
  @IsOptional()
  types?: string[];

  @ApiPropertyOptional({
    example:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
    description: 'URL da sprite do Pokémon',
  })
  @IsOptional()
  sprite?: string;
}
