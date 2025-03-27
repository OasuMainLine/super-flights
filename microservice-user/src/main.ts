import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { RabbitMQ } from './common/constants';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.AMQP_URL ?? ''],
        queue: RabbitMQ.UserQueue,
      },
    },
  );
  await app.listen();

  const logger = new Logger(RabbitMQ.UserQueue);
  logger.log('User Microservice ON 🚀');
}
bootstrap();
