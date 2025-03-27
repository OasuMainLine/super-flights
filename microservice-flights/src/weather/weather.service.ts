import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { DateArg, isSameDay } from 'date-fns';
import { firstValueFrom } from 'rxjs';
import { ILocation } from 'src/common/interfaces/location.interface';
import { IWeather } from 'src/common/interfaces/weather.interface';
import {
  IForecastDay,
  IWeatherForecastResponse,
  IWeatherResponse,
} from 'src/common/responses/weather.response';

@Injectable()
export class WeatherService {
  constructor(private readonly httpService: HttpService) {}

  async getLocation(destinationCity: string): Promise<ILocation> {
    const { data } = await firstValueFrom(
      this.httpService.get<IWeatherResponse>(`current.json`, {
        params: {
          q: destinationCity,
        },
      }),
    );
    return data.location;
  }

  async getWeatherForecast(
    location: string,
    date: DateArg<Date>,
  ): Promise<IForecastDay | undefined> {
    console.log(this.httpService);
    const { data } = await firstValueFrom(
      this.httpService.get<IWeatherForecastResponse>(`forecast.json`, {
        params: {
          q: location,
          days: 14,
        },
      }),
    );

    const forecast = data.forecast.forecastday.find((day) =>
      isSameDay(date, day.date),
    );

    return forecast;
  }
}
