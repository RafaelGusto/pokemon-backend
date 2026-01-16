import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddPokemonToTeamDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174111',
    description: 'ID do Pokémon a adicionar',
  })
  @IsString()
  pokemonId: string;
}
