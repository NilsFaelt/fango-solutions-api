import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  console.log(process.env.NODE_ENV, ' in main');
  if (process.env.NODE_ENV === 'development') {
    app.enableCors({ origin: '*' });
  } else {
    app.enableCors({
      origin: 'https://fangosolutions.com',
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
      preflightContinue: false,
    });
  }

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
