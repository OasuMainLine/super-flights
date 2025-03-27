import { FlightDTO } from 'src/flight/dto/flight.dto';
import { IPassenger } from '../interfaces/passenger.interface';

export interface IAddPassengerPayload {
  passenger: IPassenger;
  flightId: string;
}
export interface IUpdateFlightPayload {
  id: string;
  flight: FlightDTO;
}
