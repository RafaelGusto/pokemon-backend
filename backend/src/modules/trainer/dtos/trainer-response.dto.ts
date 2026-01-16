import { IsString, IsEmail, IsOptional } from 'class-validator';

export class TrainerResponseDto {
  id: string;

  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  cep?: string;

  @IsOptional()
  addressData?: any;

  createdAt: Date;

  updatedAt: Date;
}
