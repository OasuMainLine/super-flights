import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionFilter } from 'common/filters/http-exception.filter';
import { TimeoutInterceptor } from 'common/interceptors/timeout.interceptor';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { RPCExceptionFilter } from 'common/filters/rpc-exception.filter';

function swaggerUI(app: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle('SuperFlight API')
    .addBearerAuth()
    .setDescription('Scheduled Flights App')
    .setVersion('2.0.0')
    .build();
  const moduleOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      filter: true,
    },
  };
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/api/v2/docs', app, document, moduleOptions);
}
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new AllExceptionFilter());
  app.useGlobalFilters(new RPCExceptionFilter());
  app.useGlobalInterceptors(new TimeoutInterceptor());

  swaggerUI(app);
  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  Logger.log('Api-gateway listening on port ' + port);
}
bootstrap();
