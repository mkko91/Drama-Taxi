import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './AppModule';
import { DBConnector } from './db/DBConnector';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors: true});
  const dbConnector = new DBConnector();
  await dbConnector.connectToDB();

  const options = new DocumentBuilder()
    .setTitle('드라마 택시 배차')
    .setDescription('드라마 택시 배차 API description')
    .setVersion('1.0')
    .addTag('드라마 택시 배차')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
