import { NestFactory } from '@nestjs/core';
import { CameraModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(CameraModule);
  await app.listen(3000);
}
bootstrap();
