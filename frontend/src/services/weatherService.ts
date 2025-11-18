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

export async function getWeatherForecast(lat?: number, lon?: number): Promise<WeatherData[]> {
  // TODO: Replace with actual API call
  console.log('Fetching weather for coordinates:', lat, lon);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return mockWeatherData;
}

export async function getCurrentWeather(lat?: number, lon?: number): Promise<WeatherData> {
  const forecast = await getWeatherForecast(lat, lon);
  return forecast[0];
}
