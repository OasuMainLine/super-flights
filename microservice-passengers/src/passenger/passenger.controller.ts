import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { PassengerService } from './passenger.service';
import { PassengerDTO } from './dto/passenger.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PassengerMessages } from 'src/common/constants';
import { UpdatePassengerPayload } from 'src/common/payloads/payloads';

@Controller()
export class PassengerController {
  constructor(private readonly passengerService: PassengerService) {}

  @MessagePattern(PassengerMessages.CREATE)
  create(@Payload() passengerDTO: PassengerDTO) {
    return this.passengerService.create(passengerDTO);
  }

  @MessagePattern(PassengerMessages.FIND_ALL)
  findAll() {
    return this.passengerService.findAll();
  }

  @MessagePattern(PassengerMessages.FIND_ONE)
  findOne(@Payload() id: string) {
    return this.passengerService.findOne(id);
  }

  @MessagePattern(PassengerMessages.UPDATE)
  update(@Payload() payload: UpdatePassengerPayload) {
    return this.passengerService.update(payload.id, payload.passenger);
  }

  @MessagePattern(PassengerMessages.DELETE)
  delete(@Payload() id: string) {
    return this.passengerService.delete(id);
  }
}
