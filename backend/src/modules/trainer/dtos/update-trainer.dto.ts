import { IsEmail, IsString, IsOptional, Length } from 'class-validator';

export class UpdateTrainerDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @Length(3, 255)
  name?: string;

  @IsOptional()
  @IsString()
  @Length(8, 8)
  cep?: string;
}
