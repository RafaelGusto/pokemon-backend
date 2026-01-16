import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiTags('Health')
  @ApiOperation({ summary: 'Mensagem de boas-vindas' })
  @ApiResponse({
    status: 200,
    description: 'Mensagem de boas-vindas',
    schema: {
      example:
        'Pokémon API - NestJS + TypeORM. Consulte /api/trainers, /api/teams, /api/pokemon para começar.',
    },
  })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  @ApiTags('Health')
  @ApiOperation({ summary: 'Verificar status da API' })
  @ApiResponse({
    status: 200,
    description: 'API está rodando',
    schema: {
      example: {
        status: 'ok',
        message: 'API is running',
      },
    },
  })
  health() {
    return { status: 'ok', message: 'API is running' };
  }
}
