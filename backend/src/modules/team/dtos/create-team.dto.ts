import { IsString, Length } from 'class-validator';

export class CreateTeamDto {
  @IsString()
  @Length(3, 255)
  name: string;

  @IsString()
  trainerId: string;
}
