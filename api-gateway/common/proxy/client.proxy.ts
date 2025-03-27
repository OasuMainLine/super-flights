import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { RabbitMQ } from 'common/constants';

@Injectable()
export class ClientProxySuperFlights {
  constructor(private readonly config: ConfigService) {}

  private createProxy(queue: string): ClientProxy {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [this.config.getOrThrow<string>('AMQP_URL')],
        queue: queue,
      },
    });
  }

  clientProxyUsers(): ClientProxy {
    return this.createProxy(RabbitMQ.UserQueue);
  }
  clientProxyPassengers(): ClientProxy {
    return this.createProxy(RabbitMQ.PassengerQueue);
  }
  clientProxyFlight(): ClientProxy {
    return this.createProxy(RabbitMQ.FlightQueue);
  }
}
