import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

// Los 3 frontends de Render (v1 original, v2 tras grupo focal + heurística,
// v3 tras pruebas de usabilidad) comparten esta API. Se acepta cualquier
// https://learnup-talkietown-*.onrender.com por si Render agrega un sufijo
// al nombre de algún sitio.
const RENDER_FRONTENDS = /^https:\/\/learnup-talkietown-[a-z0-9-]+\.onrender\.com$/;

// Orígenes extra: FRONTEND_URL (uno o varios separados por coma, opcional)
// + el frontend de producción anterior + Vite en local.
const getAllowedOrigins = (): (string | RegExp)[] => {
  const fromEnv = (process.env.FRONTEND_URL || '')
    .split(',')
    .map((origin) => origin.trim().replace(/\/$/, ''))
    .filter(Boolean);
  return [
    RENDER_FRONTENDS,
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
