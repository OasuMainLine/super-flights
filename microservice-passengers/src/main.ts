import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { RabbitMQ } from './common/constants';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: process.env.AMQP_URL,
      queue: RabbitMQ.PassengerQueue,
    },
  });
  await app.listen();

  const logger = new Logger(RabbitMQ.PassengerQueue);
  logger.log('Passenger Microservice ON 🚀');
}
bootstrap();
