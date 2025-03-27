import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { FlightMessages, PassengerMessages } from 'common/constants';
import { ClientProxySuperFlights } from 'common/proxy/client.proxy';
import { firstValueFrom, Observable } from 'rxjs';
import { FlightDTO } from './dto/flight.dto';
import { IFlight } from 'common/interfaces/flight.interface';
import { IPassenger } from 'common/interfaces/passenger.interface';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
@ApiTags('flight')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('api/v2/flight')
export class FlightController {
  private _clientProxyFlight: ClientProxy;
  private _clientProxyPassenger: ClientProxy;
  constructor(private readonly clientProxy: ClientProxySuperFlights) {
    this._clientProxyFlight = this.clientProxy.clientProxyFlight();
    this._clientProxyPassenger = this.clientProxy.clientProxyPassengers();
  }
  @Post()
  create(@Body() flightDTO: FlightDTO): Observable<IFlight> {
    return this._clientProxyFlight.send(FlightMessages.CREATE, flightDTO);
  }

  @Get()
  findAll(): Observable<IFlight[]> {
    return this._clientProxyFlight.send(FlightMessages.FIND_ALL, '');
  }

  @Get(':id')
  findOne(@Param('id') id: string): Observable<IFlight> {
    return this._clientProxyFlight.send(FlightMessages.FIND_ONE, id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() flightDTO: FlightDTO,
  ): Observable<IFlight> {
    return this._clientProxyFlight.send(FlightMessages.UPDATE, {
      id,
      flight: flightDTO,
    });
  }

  @Delete(':id')
  delete(@Param('id') id: string): Observable<any> {
    return this._clientProxyFlight.send(FlightMessages.DELETE, id);
  }

  @Post(':flightId/passenger/:passengerId')
  async addPassenger(
    @Param('flightId') flightId: string,
    @Param(':passengerId') passengerId: string,
  ) {
    const passenger = await firstValueFrom<IPassenger | undefined>(
      this._clientProxyPassenger.send(PassengerMessages.FIND_ONE, passengerId),
    );
    if (!passenger) {
      throw new HttpException(
        `Passenger with ID ${passengerId} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    this._clientProxyFlight.send(FlightMessages.ADD_PASSENGER, {
      passenger,
      flightId,
    });
  }
}
