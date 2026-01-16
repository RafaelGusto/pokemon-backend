import { IsEmail, IsString, IsOptional, Length } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTrainerDto {
  @ApiProperty({
    example: 'trainer@example.com',
    description: 'Email único do Treinador',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Ash Ketchum',
    description: 'Nome do Treinador',
    minLength: 3,
    maxLength: 255,
  })
  @IsString()
  @Length(3, 255)
  name: string;

  @ApiPropertyOptional({
    example: '01310100',
    description: 'CEP do Treinador (8 dígitos)',
    minLength: 8,
    maxLength: 8,
  })
  @IsOptional()
  @IsString()
  @Length(8, 8)
  cep?: string;
}
