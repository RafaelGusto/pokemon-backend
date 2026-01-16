import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilita validação global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('Pokémon Backend API')
    .setDescription(
      'API REST completa para gerenciar Treinadores, Times de Pokémon e sincronização com PokéAPI e ViaCEP',
    )
    .setVersion('1.0.0')
    .addTag('Health', 'Status da API')
    .addTag('Trainers', 'Gerenciamento de Treinadores')
    .addTag('Teams', 'Gerenciamento de Times')
    .addTag('Pokémon', 'Gerenciamento de Pokémons')
    .addTag('CEP', 'Integração com ViaCEP')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.APP_PORT || 3000;
  await app.listen(port);
  console.log(`🚀 API rodando em http://localhost:${port}`);
  console.log(`📚 Documentação Swagger: http://localhost:${port}/api/docs`);
}
bootstrap();
