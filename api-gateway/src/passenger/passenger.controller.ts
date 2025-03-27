import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ClientProxySuperFlights } from 'common/proxy/client.proxy';
import { PassengerDTO } from './dto/passenger.dto';
import { IPassenger } from 'common/interfaces/passenger.interface';
import { PassengerMessages } from 'common/constants';
import { Observable } from 'rxjs';
import { ApiTags } from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';
@ApiTags('passenger')
@Controller('api/v2/passenger')
export class PassengerController {
  private _clientProxyPassenger: ClientProxy;
  constructor(private readonly clientProxy: ClientProxySuperFlights) {
    this._clientProxyPassenger = clientProxy.clientProxyPassengers();
  }

  @Post()
  create(@Body() passengerDTO: PassengerDTO): Observable<IPassenger> {
    return this._clientProxyPassenger.send(
      PassengerMessages.CREATE,
      passengerDTO,
    );
  }

  @Get()
  findAll(): Observable<IPassenger[]> {
    return this._clientProxyPassenger.send(PassengerMessages.FIND_ALL, '');
  }

  @Get(':id')
  findOne(@Param('id') id: string): Observable<IPassenger> {
    return this._clientProxyPassenger.send(PassengerMessages.FIND_ONE, id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() passengerDTO: PassengerDTO,
  ): Observable<IPassenger> {
    return this._clientProxyPassenger.send(PassengerMessages.UPDATE, {
      id,
      passenger: passengerDTO,
    });
  }

  @Delete(':id')
  delete(@Param('id') id: string): Observable<any> {
    return this._clientProxyPassenger.send(PassengerMessages.DELETE, id);
  }
}
