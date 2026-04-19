import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig } from './config/swagger.config';
import { ConfigService } from '@nestjs/config';
import { IAppConfig } from './config/app.config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Get config service
  const configService = app.get(ConfigService);
  const appConfig = configService.get<IAppConfig>('app');

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that don't have decorators
      forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are present
      transform: true, // Automatically transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true, // Convert types automatically
      },
    }),
  );

  // Global Prefix for Api Version
  app.setGlobalPrefix(`${appConfig?.apiPrefix}/${appConfig?.apiVersion}`);

  // Enable CORS
  app.enableCors({
    origin: appConfig?.corsOrigin,
    credentials: true,
  });

  // Enable shutdown hooks(graceful shutdown)
  app.enableShutdownHooks();

  // swagger setup
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  // Start server
  const port = appConfig?.port || 3000;
  await app.listen(port);

  console.log(`🚀 Super Fitness API is running on: ${await app.getUrl()}`);
  console.log(`📝 API Documentation: ${await app.getUrl()}/api-docs`);
}
bootstrap();
