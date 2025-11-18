import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import weatherService from '../services/weather.service';

class WeatherController {
  async getWeatherForFarm(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { farmId } = req.params;
      const weatherData = await weatherService.getWeatherForFarm(farmId);
      
      res.status(200).json({
        success: true,
        data: weatherData,
      });
    } catch (error) {
      next(error);
    }
  }

  async getWeatherByCoords(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const lat = req.query.lat ? parseFloat(String(req.query.lat)) : undefined;
      const lon = req.query.lon ? parseFloat(String(req.query.lon)) : undefined;

      if (lat === undefined || lon === undefined || Number.isNaN(lat) || Number.isNaN(lon)) {
        return res.status(400).json({ success: false, message: 'lat and lon query params are required and must be numbers' });
      }

      const weatherData = await weatherService.fetchWeather(lat, lon);

      res.status(200).json({ success: true, data: weatherData });
    } catch (error) {
      next(error);
    }
  }
}

export default new WeatherController();
