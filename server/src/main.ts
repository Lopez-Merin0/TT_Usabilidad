import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

// Orígenes permitidos: FRONTEND_URL (uno o varios separados por coma, se
// configura en Render) + el frontend de producción anterior + Vite en local.
const getAllowedOrigins = (): string[] => {
  const fromEnv = (process.env.FRONTEND_URL || '')
    .split(',')
    .map((origin) => origin.trim().replace(/\/$/, ''))
    .filter(Boolean);
  return [
    ...fromEnv,
    'https://talkie-town.onrender.com',
    'http://localhost:5173',
  ];
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: getAllowedOrigins(),
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  await app.listen(process.env.PORT || 5000);
}

bootstrap();
