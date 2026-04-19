import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Super Fitness API')
  .setDescription('API documentation for Super Fitness App')
  .setVersion('1.0')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter your JWT token',
      in: 'header',
    },
    'JWT-auth', // use this in @ApiBearerAuth('JWT-auth') in controllers
  )
  .build();
