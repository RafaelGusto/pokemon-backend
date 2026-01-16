import { IsEmail, IsString, IsOptional, Length } from 'class-validator';

export class CreateTrainerDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(3, 255)
  name: string;

  @IsOptional()
  @IsString()
  @Length(8, 8)
  cep?: string;
}
