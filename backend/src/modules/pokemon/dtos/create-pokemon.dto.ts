import { IsNumber, IsOptional } from 'class-validator';

export class CreatePokemonDto {
  @IsNumber()
  externalId: number;

  @IsOptional()
  name?: string;

  @IsOptional()
  types?: string[];

  @IsOptional()
  sprite?: string;
}
