import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { execSync } from 'child_process';

async function bootstrap() {
  execSync(
    'npm install && npx prisma migrate save --name init && npx prisma migrate up && npm start ',
  );
  const app = await NestFactory.create(AppModule, { cors: true });
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
