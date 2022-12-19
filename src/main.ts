import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.use(cookieSession({ keys: ['asdfasdfd'] }));
  // app.useGlobalPipes(new ValidationPipe({ whitelist: true }))
  await app.listen(3001);
}
bootstrap();