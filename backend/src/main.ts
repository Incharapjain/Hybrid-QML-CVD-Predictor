// backend/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 🌍 ENABLE CORS: Allows the React App on port 3001 to securely call your backend
  app.enableCors({
    origin: 'http://localhost:3001', // Your React app location
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(3000);
  console.log('🚀 NestJS API Gateway successfully running on http://localhost:3000');
}
bootstrap();