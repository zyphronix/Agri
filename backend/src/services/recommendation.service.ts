import axios from 'axios';
import config from '../config/env';
import { RecommendationResponse } from '../types';
import { mockRecommendations } from '../mock/recommendations';
import weatherService from './weather.service';
import soilService from './soil.service';

class RecommendationService {
  async getCropRecommendations(farmId: string): Promise<RecommendationResponse> {
    const FarmPlot = require('../models/FarmPlot').default;
    const farm = await FarmPlot.findById(farmId);
    
    if (!farm) {
      throw new Error('Farm not found');
    }

    // Gather all required data
    const [weatherForecast, soilData] = await Promise.all([
      weatherService.fetchWeather(farm.location.lat, farm.location.lon),
      soilService.getSoilDataForFarm(farmId),
    ]);

    // weatherService.fetchWeather now returns ForecastDay[] (array). Use the first item as 'current'
    const currentWeather = Array.isArray(weatherForecast) && weatherForecast.length > 0 ? weatherForecast[0] : null;

    // Prepare payload for ML service
    const payload = {
      location: farm.location,
      weather: {
        temperature: currentWeather ? currentWeather.temp : null,
        humidity: currentWeather ? currentWeather.humidity : null,
        rainfall: currentWeather ? currentWeather.rainfall : null,
      },
      soil: {
        nitrogen: soilData.nitrogen,
        phosphorus: soilData.phosphorus,
        potassium: soilData.potassium,
        pH: soilData.pH,
      },
    };

    // Call ML microservice
    return this.callMLService(payload);
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
}

export default new RecommendationService();
