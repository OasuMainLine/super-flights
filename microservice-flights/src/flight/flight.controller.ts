import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { FlightDTO } from './dto/flight.dto';
import { FlightService } from './flight.service';
import { Controller, Body, HttpStatus } from '@nestjs/common';
import { FlightMessages } from 'src/common/constants';
import {
  IAddPassengerPayload,
  IUpdateFlightPayload,
} from 'src/common/payloads/payloads';

@Controller()
export class FlightController {
  constructor(private readonly flightService: FlightService) {}

  @MessagePattern(FlightMessages.CREATE)
  create(@Payload() flightDTO: FlightDTO) {
    return this.flightService.create(flightDTO);
  }

  @MessagePattern(FlightMessages.FIND_ALL)
  findAll() {
    return this.flightService.findAll();
  }

  @MessagePattern(FlightMessages.FIND_ONE)
  async findOne(@Payload() id: string) {
    const flight = await this.flightService.findOne(id);
    if (!flight) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: 'There is not a flight with this id',
      });
    }

    return flight;
  }

  @MessagePattern(FlightMessages.UPDATE)
  update(@Payload() payload: IUpdateFlightPayload) {
    return this.flightService.update(payload.id, payload.flight);
  }

  @MessagePattern(FlightMessages.DELETE)
  delete(@Payload('id') id: string) {
    return this.flightService.delete(id);
  }

  @MessagePattern(FlightMessages.ADD_PASSENGER)
  async addPassenger(@Payload() payload: IAddPassengerPayload) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.flightService.addPassenger(
      payload.flightId,
      payload.passenger.id,
    );
  }
}
