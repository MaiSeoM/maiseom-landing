import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.WEB_URL?.split(',') || ['http://localhost:3000'],
    credentials: true,
  });
  app.use(cookieParser());
  app.use('/billing/webhook', bodyParser.raw({ type: '*/*' }));
  app.use(bodyParser.json());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`API running on http://localhost:${port}`);
}
bootstrap();
