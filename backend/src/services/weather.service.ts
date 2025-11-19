import axios from 'axios';
import config from '../config/env';
import { ForecastDay } from '../types';
import { mockWeatherData } from '../mock/weather';

class WeatherService {
  async fetchWeather(lat?: number, lon?: number): Promise<{ forecast: ForecastDay[]; city?: string }> {
    // Use OpenWeatherMap 5-day/3-hour forecast endpoint but request 7 points
    // Example: https://api.openweathermap.org/data/2.5/forecast?lat=25.9&lon=76.9&units=metric&cnt=7&appid=KEY

    if (lat === undefined || lon === undefined) {
      console.warn('fetchWeather called without coordinates, returning mock data');
      return { forecast: mockWeatherData.forecast, city: undefined };
    }

    if (!config.weatherApiKey) {
      console.warn('No weather API key configured, returning mock data');
      return { forecast: mockWeatherData.forecast, city: undefined };
    }

    try {
      const url = 'https://api.openweathermap.org/data/2.5/forecast';
      // Request 7 forecast points
      const params = { lat, lon, units: 'metric', cnt: 7, appid: config.weatherApiKey };

      // Debug: log request params (do not print the full API key)
      console.debug('WeatherService: calling OpenWeather forecast', {
        url,
        params: { ...params, appid: config.weatherApiKey ? '***REDACTED***' : '' },
        hasKey: !!config.weatherApiKey,
      });

      const response = await axios.get(url, { params });

      const list = response.data && Array.isArray(response.data.list) ? response.data.list : [];

      if (list.length === 0) return { forecast: mockWeatherData.forecast, city: response.data?.city?.name };

      // Map API items to ForecastDay-like objects that frontend expects
      const mapped: ForecastDay[] = list.map((item: any) => {
        const unix = item.dt || Date.now() / 1000;
        const date = item.dt_txt ? item.dt_txt.split(' ')[0] : new Date(unix * 1000).toISOString().split('T')[0];
        const temp = typeof item.main?.temp === 'number' ? Math.round(item.main.temp * 10) / 10 : 0;
        const tempMin = typeof item.main?.temp_min === 'number' ? Math.round(item.main.temp_min * 10) / 10 : temp;
        const tempMax = typeof item.main?.temp_max === 'number' ? Math.round(item.main.temp_max * 10) / 10 : temp;
        const humidity = item.main?.humidity ?? 0;
        const rainfall = (item.rain && (item.rain['3h'] ?? item.rain['1h'])) ?? 0;
        const weather = (item.weather && item.weather[0] && (item.weather[0].main || item.weather[0].description)) || 'Unknown';
        const windMs = item.wind?.speed ?? 0;
        const windKmh = Math.round((windMs * 3.6) * 10) / 10;

        // Simple alert logic based on rainfall thresholds
        let alert: 'none' | 'moderate' | 'high' = 'none';
        if (rainfall >= 30) alert = 'high';
        else if (rainfall >= 10) alert = 'moderate';

        // Build object shaped for frontend mapping (use reported min/max when available)
        return {
          date,
          temp,
          humidity,
          rainfall,
          weather,
          // extras (now using reported min/max)
          temperature: { min: tempMin, max: tempMax, current: temp },
          windSpeed: windKmh,
          alert,
        } as any;
      });

      return { forecast: mapped, city: response.data?.city?.name };
    } catch (error: any) {
      console.error('Weather API error:', error?.message || error);
      // fallback to mock data (forecast array)
      return { forecast: mockWeatherData.forecast, city: undefined };
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
