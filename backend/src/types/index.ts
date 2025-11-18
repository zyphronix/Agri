import { Request } from 'express';
import { Document } from 'mongoose';

export interface IUser extends Document {
  phone: string;
  name?: string;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IFarmPlot extends Document {
  userId: string;
  name: string;
  location: {
    lat: number;
    lon: number;
  };
  soil: {
    nitrogen: number;
    phosphorus: number;
    potassium: number;
    pH: number;
  };
  area: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    phone: string;
  };
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  rainfall: number;
  alerts: string[];
  forecast: ForecastDay[];
}

export interface ForecastDay {
  date: string;
  temp: number;
  humidity: number;
  rainfall: number;
  weather: string;
}

export interface SoilData {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  pH: number;
  organic_carbon?: number;
  source: string;
}

export interface CropRecommendation {
  name: string;
  score: number;
  imageUrl?: string;
  reason?: string;
}

export interface RecommendationResponse {
  crops: CropRecommendation[];
  explanationAudioUrl?: string;
}
