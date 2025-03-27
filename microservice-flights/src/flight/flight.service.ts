import { FlightDTO } from './dto/flight.dto';
import { FLIGHT } from './../common/models/models';
import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IFlight } from 'src/common/interfaces/flight.interface';
import { IWeather } from 'src/common/interfaces/weather.interface';
import { WeatherService } from 'src/weather/weather.service';
import { ISingleForecast } from 'src/common/responses/weather.response';

@Injectable()
export class FlightService {
  constructor(
    @InjectModel(FLIGHT.name)
    private readonly model: Model<IFlight>,
    private readonly weatherService: WeatherService,
  ) {}

  assign(
    { _id, pilot, airplane, destinationCity, flightDate, passengers }: IFlight,
    weather: IWeather[] | string,
  ): IFlight {
    return Object.assign({
      _id,
      pilot,
      airplane,
      destinationCity,
      flightDate,
      passengers,
      weather,
    });
  }

  async create(flightDTO: FlightDTO): Promise<IFlight> {
    const newFlight = new this.model(flightDTO);
    return await newFlight.save();
  }

  async findAll(): Promise<IFlight[]> {
    return await this.model.find().populate('passengers');
  }

  async findOne(id: string): Promise<IFlight | null> {
    const flight = await this.model.findById(id).populate('passengers');

    if (!flight) return null;
    const forecast = await this.weatherService.getWeatherForecast(
      flight?.destinationCity,
      flight.flightDate,
    );

    return this.assign(
      flight,
      forecast ? forecast.hour : 'Forecast for this date is not available',
    );
  }

  async update(id: string, flightDTO: FlightDTO): Promise<IFlight | null> {
    return await this.model.findByIdAndUpdate(id, flightDTO, { new: true });
  }

  async delete(id: string) {
    await this.model.findByIdAndDelete(id);
    return {
      status: HttpStatus.OK,
      msg: 'Deleted',
    };
  }

  async addPassenger(
    flightId: string,
    passengerId: string,
  ): Promise<IFlight | null> {
    return await this.model
      .findByIdAndUpdate(
        flightId,
        {
          $addToSet: { passengers: passengerId },
        },
        { new: true },
      )
      .populate('passengers');
  }
}
