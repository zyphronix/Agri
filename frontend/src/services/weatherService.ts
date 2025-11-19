export interface WeatherData {
  date: string;
  temperature: {
    min: number;
    max: number;
    current: number;
  };
  humidity: number;
  rainfall: number;
  windSpeed: number;
  condition: string;
  alert?: 'high' | 'moderate' | 'none';
}

// Mock weather data
const mockWeatherData: WeatherData[] = [
  {
    date: new Date().toISOString().split('T')[0],
    temperature: { min: 22, max: 35, current: 28 },
    humidity: 65,
    rainfall: 0,
    windSpeed: 12,
    condition: 'Sunny',
    alert: 'none',
  },
  {
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    temperature: { min: 23, max: 34, current: 29 },
    humidity: 70,
    rainfall: 5,
    windSpeed: 15,
    condition: 'Partly Cloudy',
    alert: 'none',
  },
  {
    date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
    temperature: { min: 21, max: 30, current: 26 },
    humidity: 80,
    rainfall: 25,
    windSpeed: 20,
    condition: 'Rainy',
    alert: 'moderate',
  },
  {
    date: new Date(Date.now() + 259200000).toISOString().split('T')[0],
    temperature: { min: 20, max: 28, current: 24 },
    humidity: 85,
    rainfall: 45,
    windSpeed: 25,
    condition: 'Heavy Rain',
    alert: 'high',
  },
  {
    date: new Date(Date.now() + 345600000).toISOString().split('T')[0],
    temperature: { min: 22, max: 32, current: 27 },
    humidity: 75,
    rainfall: 10,
    windSpeed: 18,
    condition: 'Cloudy',
    alert: 'none',
  },
  {
    date: new Date(Date.now() + 432000000).toISOString().split('T')[0],
    temperature: { min: 23, max: 36, current: 30 },
    humidity: 60,
    rainfall: 0,
    windSpeed: 10,
    condition: 'Sunny',
    alert: 'none',
  },
  {
    date: new Date(Date.now() + 518400000).toISOString().split('T')[0],
    temperature: { min: 24, max: 37, current: 31 },
    humidity: 55,
    rainfall: 0,
    windSpeed: 8,
    condition: 'Hot',
    alert: 'moderate',
  },
];

import api from '@/lib/api';

export async function getWeatherForecast(lat?: number, lon?: number, farmId?: string): Promise<{ location?: string; forecast: WeatherData[] }> {
  // If we have a farmId call farm weather endpoint, else send coords if provided
    try {
      if (farmId) {
        const res = await api.get(`/api/weather/${farmId}`);
        // backend returns { success: true, data: ForecastDay[] , location }
        const payload = res; // keep full payload (api.get already returns parsed body)
        const location = payload && (payload.location || payload.city) ? (payload.location || payload.city) : undefined;
        const raw = payload && payload.success && payload.data ? payload.data : Array.isArray(payload) ? payload : [];
      // normalize backend ForecastDay[] to frontend WeatherData[]
      const mapped = (raw as any[]).map((f) => ({
        date: f.date || new Date().toISOString().split('T')[0],
        temperature: {
          min: (f.temperature?.min ?? f.temp_min ?? f.temp ?? 0),
          max: (f.temperature?.max ?? f.temp_max ?? f.temp ?? 0),
          current: (f.temperature?.current ?? f.temp ?? 0),
        },
        humidity: f.humidity ?? f.main?.humidity ?? 0,
        rainfall: f.rainfall ?? (f.rain && (f.rain['3h'] ?? f.rain['1h'])) ?? 0,
        windSpeed: f.windSpeed ?? f.wind?.speed ?? 0,
        condition: f.condition ?? f.weather ?? 'Unknown',
        alert: f.alert ?? 'none',
      }));
      return { location, forecast: mapped };
    }

    const query = lat !== undefined && lon !== undefined ? `?lat=${lat}&lon=${lon}` : '';
    const res = await api.get(`/api/weather${query}`);
    const payload = res; // api.get returns parsed response body
    const location = payload && (payload.location || payload.city) ? (payload.location || payload.city) : undefined;
    const raw = payload && payload.success && payload.data ? payload.data : Array.isArray(payload) ? payload : [];
    const mapped = (raw as any[]).map((f) => ({
      date: f.date || new Date().toISOString().split('T')[0],
      temperature: {
        min: (f.temperature?.min ?? f.temp_min ?? f.temp ?? 0),
        max: (f.temperature?.max ?? f.temp_max ?? f.temp ?? 0),
        current: (f.temperature?.current ?? f.temp ?? 0),
      },
      humidity: f.humidity ?? f.main?.humidity ?? 0,
      rainfall: f.rainfall ?? (f.rain && (f.rain['3h'] ?? f.rain['1h'])) ?? 0,
      windSpeed: f.windSpeed ?? f.wind?.speed ?? 0,
      condition: f.condition ?? f.weather ?? 'Unknown',
      alert: f.alert ?? 'none',
    }));
    if (mapped.length === 0) return { location, forecast: [] };
    return { location, forecast: mapped };
  } catch (e) {
    // fallback to mock data on failure
    console.warn('Weather API failed, using mock data', e);
    return { location: undefined, forecast: mockWeatherData };
  }
}

export async function getCurrentWeather(lat?: number, lon?: number, farmId?: string): Promise<{ location?: string; weather?: WeatherData }> {
  const resp = await getWeatherForecast(lat, lon, farmId);
  return { location: resp.location, weather: resp.forecast && resp.forecast.length > 0 ? resp.forecast[0] : undefined };
}
