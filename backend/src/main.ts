import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Enable CORS for frontend applications
  // Parse CORS origins from environment variable (comma-separated)
  const corsOriginsEnv = process.env.CORS_ORIGINS || '';
  const corsOrigins = corsOriginsEnv
    ? corsOriginsEnv.split(',').map((origin) => origin.trim())
    : [
        // Fallback origins for development
        'http://localhost:3060',
        'http://localhost:3061',
        `http://${process.env.SERVER_IP}:3060`,
        `http://${process.env.SERVER_IP}:3061`,
      ];

  app.enableCors({
    origin: corsOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  });

  // Global prefix for all routes
  app.setGlobalPrefix('api');

  // Enable validation pipes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Experience Club API')
    .setDescription(
      'Complete API documentation for Experience Club e-commerce platform',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth', // This name here is important for matching up with @ApiBearerAuth() in your controller!
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        name: 'API-Token',
        description: 'Enter NEXTAUTH_SECRET token for external API access',
        in: 'header',
      },
      'API-Token', // This name is used for @ApiBearerAuth('API-Token') in checkout-api controller
    )
    .addTag('Authentication', 'User authentication and authorization')
    .addTag('Products', 'Product management and operations')
    .addTag('Brands', 'Brand management')
    .addTag('Categories', 'Category management')
    .addTag('Images', 'Image management')
    .addTag('Checkout API', 'External checkout API with bearer token authentication')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = configService.get('PORT') || 3002;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}/api`);
  console.log(
    `Swagger documentation available at: http://localhost:${port}/api/docs`,
  );
}
bootstrap();
