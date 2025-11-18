import axios from 'axios';
import config from '../config/env';
import { ForecastDay } from '../types';
import { mockWeatherData } from '../mock/weather';

class WeatherService {
  async fetchWeather(lat: number, lon: number): Promise<ForecastDay[]> {
    // Use OpenWeatherMap current weather endpoint to fetch current weather
    // Endpoint: https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${key}

    if (!lat || !lon) {
      console.warn('fetchWeather called without coordinates, returning mock data');
      return mockWeatherData.forecast;
    }

    if (!config.weatherApiKey) {
      console.warn('No weather API key configured, returning mock data');
      return mockWeatherData.forecast;
    }

    try {
      const url = 'https://api.openweathermap.org/data/2.5/weather';
      // Debug: log request params (do not print the full API key)
      console.debug('WeatherService: calling OpenWeather', {
        url,
        params: { lat, lon, units: 'metric', appid: config.weatherApiKey ? '***REDACTED***' : '' },
        hasKey: !!config.weatherApiKey,
      });

      const response = await axios.get(url, {
        params: {
          lat,
          lon,
          units: 'metric',
          appid: config.weatherApiKey,
        },
      });

      const d = response.data;

      const date = new Date().toISOString().split('T')[0];

      const forecastDay: ForecastDay = {
        date,
        temp: (d.main && (Math.round(d.main.temp * 10) / 10)) ?? 0,
        humidity: (d.main && d.main.humidity) ?? 0,
        rainfall: (d.rain && (d.rain['1h'] ?? d.rain['3h'])) ?? 0,
        weather: (d.weather && d.weather[0] && (d.weather[0].main || d.weather[0].description)) || 'Unknown',
      };

      // Return single-day forecast array
      return [forecastDay];
    } catch (error: any) {
      console.error('Weather API error:', error?.message || error);
      // fallback to mock data (forecast array)
      return mockWeatherData.forecast;
    }
  }

  async getWeatherForFarm(farmId: string) {
    const FarmPlot = require('../models/FarmPlot').default;
    const farm = await FarmPlot.findById(farmId);

    if (!farm) {
      throw new Error('Farm not found');
    }

    return this.fetchWeather(farm.location.lat, farm.location.lon);
  }
}

export default new WeatherService();
