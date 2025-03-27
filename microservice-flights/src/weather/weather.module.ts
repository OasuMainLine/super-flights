import { Module } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { URLSearchParams } from 'url';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule.forFeature(() => ({}))],
      useFactory: () => ({
        baseURL: 'http://api.weatherapi.com/v1/',
        timeout: 10000,
        maxRedirects: 1,
        paramsSerializer: (params) => {
          const key = process.env.WEATHER_API_KEY ?? '';
          params['key'] = key;
          return new URLSearchParams(params).toString();
        },
      }),
    }),
  ],
  providers: [WeatherService],
  exports: [WeatherService],
})
export class WeatherModule {}
