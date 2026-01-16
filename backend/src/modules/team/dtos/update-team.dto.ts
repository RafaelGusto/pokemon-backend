import { IsString, IsOptional, Length } from 'class-validator';

export class UpdateTeamDto {
  @IsOptional()
  @IsString()
  @Length(3, 255)
  name?: string;
}
