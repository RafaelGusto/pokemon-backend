import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTeamDto {
  @ApiProperty({
    example: 'Equipe Pikachu',
    description: 'Nome do Time',
    minLength: 3,
    maxLength: 255,
  })
  @IsString()
  @Length(3, 255)
  name: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID do Treinador proprietário',
  })
  @IsString()
  trainerId: string;
}
