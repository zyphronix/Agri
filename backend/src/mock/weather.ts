import { WeatherData } from '../types';

export const mockWeatherData: WeatherData = {
  temperature: 28.5,
  humidity: 65,
  rainfall: 15,
  alerts: ['Moderate rainfall expected in next 48 hours'],
  forecast: [
    {
      date: '2025-11-19',
      temp: 29,
      humidity: 68,
      rainfall: 20,
      weather: 'Partly Cloudy',
    },
    {
      date: '2025-11-20',
      temp: 27,
      humidity: 72,
      rainfall: 35,
      weather: 'Rainy',
    },
    {
      date: '2025-11-21',
      temp: 26,
      humidity: 75,
      rainfall: 45,
      weather: 'Heavy Rain',
    },
    {
      date: '2025-11-22',
      temp: 28,
      humidity: 70,
      rainfall: 10,
      weather: 'Cloudy',
    },
    {
      date: '2025-11-23',
      temp: 30,
      humidity: 60,
      rainfall: 5,
      weather: 'Sunny',
    },
    {
      date: '2025-11-24',
      temp: 31,
      humidity: 58,
      rainfall: 0,
      weather: 'Clear',
    },
    {
      date: '2025-11-25',
      temp: 29,
      humidity: 62,
      rainfall: 10,
      weather: 'Partly Cloudy',
    },
  ],
};
