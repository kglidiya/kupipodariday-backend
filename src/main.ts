import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const configService = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.use(
    helmet({
      crossOriginResourcePolicy: true,
    }),
  );
  await app.listen(configService.get('PORT'));
}
bootstrap();
