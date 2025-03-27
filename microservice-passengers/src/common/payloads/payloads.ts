import { PassengerDTO } from 'src/passenger/dto/passenger.dto';

export type UpdatePassengerPayload = {
  id: string;
  passenger: PassengerDTO;
};
