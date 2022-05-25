require('dotenv').config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter } from '@nestjs/platform-fastify';

declare const module: any;

import * as httpProxy from 'http-proxy';

const proxy = httpProxy.createProxyServer({ secure: false });

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    new FastifyAdapter({ logger: true }),
  );
  console.log('APP_SERVICE_URL', process.env.APP_SERVICE_URL);

  function logger(req, res, next) {
    console.log(`Request...`, req.url);
    if (
      req.url.startsWith('/app') ||
      req.url.startsWith('/@vite') ||
      req.url.startsWith('/@fs') ||
      req.url.startsWith('/src') ||
      req.url.startsWith('/node_modules')
    ) {
      proxy.web(
        req,
        res,
        {
          target: process.env.APP_SERVICE_URL,
          secure: false,
        },
        (err) => {
          console.log('err: ', err);
        },
      );
    } else {
      next();
    }
  }

  app.use(logger);
  app.enableCors();

  app.setGlobalPrefix('api');
  await app.listen(3003, '0.0.0.0');
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
