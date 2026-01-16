import { IsString } from 'class-validator';

export class AddPokemonToTeamDto {
  @IsString()
  pokemonId: string;
}
