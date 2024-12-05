import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { greetings, owners } from './core/config/landing';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet())

  // versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '2',
    prefix:'api/v',
  })
  app.enableCors({
    origin:process.env.FRAMES_FRONTEND_URL,
    methods:'GET, POST, PUT, PATCH, DELETE'
  })
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3001);
  console.log(greetings)
  console.log(owners)

}
bootstrap();
