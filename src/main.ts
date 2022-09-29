import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  app.setGlobalPrefix(':company?/api'); // onlinequadros.com.br/nome_do_tenant/api

  const config = new DocumentBuilder()
    .setTitle('Online Quadros')
    .setDescription('API Online Quadros')
    .setVersion('1.0')
    .addTag('app')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(AppModule.port);
}
bootstrap();
