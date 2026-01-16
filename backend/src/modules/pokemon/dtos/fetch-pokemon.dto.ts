import { IsNumber, IsOptional } from 'class-validator';

export class FetchPokemonDto {
  @IsNumber()
  externalId: number;

  @IsOptional()
  forceSync?: boolean;
}
