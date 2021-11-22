import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {FastifyAdapter} from "@nestjs/platform-fastify";

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new FastifyAdapter({ logger: true }));
  await app.listen(3000, '0.0.0.0');

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
