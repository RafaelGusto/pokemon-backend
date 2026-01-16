import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Pokémon API - NestJS + TypeORM. Consulte /api/trainers, /api/teams, /api/pokemon para começar.';
  }
}
