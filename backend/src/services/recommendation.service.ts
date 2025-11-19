import axios from 'axios';
import config from '../config/env';
import { RecommendationResponse } from '../types';
import { mockRecommendations } from '../mock/recommendations';
import weatherService from './weather.service';
import soilService from './soil.service';
const PredictionHistory = require('../models/PredictionHistory').default;

class RecommendationService {
  async getCropRecommendations(farmId: string): Promise<RecommendationResponse> {
    const FarmPlot = require('../models/FarmPlot').default;
    const farm = await FarmPlot.findById(farmId);
    
    if (!farm) {
      throw new Error('Farm not found');
    }

    // Gather required data
    const soilData = await soilService.getSoilDataForFarm(farmId);

    // Fetch seasonal climate aggregates (90-day)
    let seasonal: any = null;
    try {
      seasonal = await this.getSeasonalClimateForFarm(farmId);
    } catch (err) {
      console.warn('Failed to fetch seasonal climate for farm, falling back to current weather', err);
      const wf = await weatherService.fetchWeather(farm.location.lat, farm.location.lon);
      const currentWeather = Array.isArray(wf) && wf.length > 0 ? wf[0] : null;
      seasonal = {
        temperature_90_day_avg: currentWeather ? currentWeather.temp : null,
        humidity_90_day_avg: currentWeather ? currentWeather.humidity : null,
        rainfall_90_day_sum: currentWeather ? currentWeather.rainfall : null,
      };
    }

    // Build payload expected by Python prediction API
    const mlPayload = {
      N: Number(soilData.nitrogen || farm.soil?.nitrogen || 0),
      P: Number(soilData.phosphorus || farm.soil?.phosphorus || 0),
      K: Number(soilData.potassium || farm.soil?.potassium || 0),
      temperature: seasonal?.temperature_90_day_avg ?? null,
      humidity: seasonal?.humidity_90_day_avg ?? null,
      ph: Number(farm.soil?.pH ?? soilData.pH ?? 7),
      rainfall: seasonal?.rainfall_90_day_sum ?? null,
    };

    // Call external Python prediction service and persist the result
    const mlUrl = config.mlServiceUrl || 'https://agri-python-backend.onrender.com/predict';
    try {
      const resp = await axios.post(mlUrl, mlPayload, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 30000,
      });

      // Save prediction history
      try {
        await PredictionHistory.create({
          farmId: farmId.toString(),
          input: mlPayload,
          response: resp.data,
          success: resp.status === 200,
        });
      } catch (saveErr) {
        console.error('Failed to save prediction history:', saveErr);
      }

      // Return prediction response (assume service returns proper structure)
      return resp.data as RecommendationResponse;
    } catch (error: any) {
      console.error('Prediction service call failed:', error?.message || error);
      // Save failed attempt
      try {
        await PredictionHistory.create({
          farmId: farmId.toString(),
          input: mlPayload,
          response: { error: error?.message || error },
          success: false,
        });
      } catch (saveErr) {
        console.error('Failed to save failed prediction history:', saveErr);
      }

      // Fallback to mock recommendations
      return mockRecommendations;
    }
  }

  private async callMLService(payload: any): Promise<RecommendationResponse> {
    // TODO: Integrate with actual ML microservice
    /*
    try {
      const response = await axios.post(config.mlServiceUrl, payload, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 30000,
      });
      return response.data;
    } catch (error) {
      console.error('ML Service error:', error);
      throw new Error('Failed to get crop recommendations');
    }
    */

    console.log('🤖 Calling ML service with payload:', JSON.stringify(payload, null, 2));
    // Return mock recommendations for now
    return mockRecommendations;
  }

  // Fetch 90-day seasonal aggregates from Open-Meteo Seasonal API
  async fetchSeasonalClimate(latitude: number, longitude: number) {
    const url = `https://seasonal-api.open-meteo.com/v1/seasonal?latitude=${encodeURIComponent(
      latitude
    )}&longitude=${encodeURIComponent(longitude)}&daily=precipitation_sum,relative_humidity_2m_mean,temperature_2m_mean&forecast_days=90`;

    try {
      const res = await axios.get(url, { timeout: 20000, validateStatus: () => true });
      if (res.status !== 200) {
        console.warn('Open-Meteo seasonal API returned non-200 status', res.status, res.data);
        throw new Error('Failed to fetch seasonal climate data');
      }

      const daily = res.data?.daily || {};
      const temps: number[] = Array.isArray(daily.temperature_2m_mean) ? daily.temperature_2m_mean : [];
      const hums: number[] = Array.isArray(daily.relative_humidity_2m_mean) ? daily.relative_humidity_2m_mean : [];
      const precs: number[] = Array.isArray(daily.precipitation_sum) ? daily.precipitation_sum : [];

      const days = Math.max(temps.length, hums.length, precs.length);

      const sum = (arr: number[]) => arr.reduce((a, b) => a + (Number(b) || 0), 0);

      const tempAvg = temps.length ? sum(temps) / temps.length : null;
      const humidityAvg = hums.length ? sum(hums) / hums.length : null;
      const rainfallSum = precs.length ? sum(precs) : null;

      return {
        temperature_90_day_avg: tempAvg !== null ? Number(tempAvg.toFixed(2)) : null,
        humidity_90_day_avg: humidityAvg !== null ? Number(humidityAvg.toFixed(2)) : null,
        rainfall_90_day_sum: rainfallSum !== null ? Number(rainfallSum.toFixed(2)) : null,
        days: days,
        raw: { daily },
      };
    } catch (error: any) {
      console.error('Error fetching seasonal climate:', error?.message || error);
      throw error;
    }
  }

  async getSeasonalClimateForFarm(farmId: string) {
    const FarmPlot = require('../models/FarmPlot').default;
    const farm = await FarmPlot.findById(farmId);
    if (!farm) throw new Error('Farm not found');

    const lat = farm.location?.lat;
    const lon = farm.location?.lon;
    if (typeof lat !== 'number' || typeof lon !== 'number') throw new Error('Farm location missing');

    return this.fetchSeasonalClimate(lat, lon);
  }
}

export default new RecommendationService();
