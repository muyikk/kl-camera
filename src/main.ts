import { NestFactory } from '@nestjs/core';
import { CameraModule } from './camera.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(CameraModule);
  
  const config = new DocumentBuilder()
  .setTitle('Camera Module')
  .setDescription('The Camera Module API description')
  .setVersion('1.0')
  .addServer('/api')
  .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  app.enableCors();
  app.setGlobalPrefix('/api');
  
  await app.listen(3000);
}
bootstrap();
