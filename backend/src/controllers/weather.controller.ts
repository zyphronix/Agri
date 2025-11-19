import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import weatherService from '../services/weather.service';

class WeatherController {
  async getWeatherForFarm(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { farmId } = req.params;
      const result = await weatherService.getWeatherForFarm(farmId);

      res.status(200).json({
        success: true,
        data: result && (result as any).forecast ? (result as any).forecast : [],
        location: result && (result as any).city ? (result as any).city : undefined,
      });
    } catch (error) {
      next(error);
    }
  }

  async getWeatherByCoords(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const lat = req.query.lat ? parseFloat(String(req.query.lat)) : undefined;
      const lon = req.query.lon ? parseFloat(String(req.query.lon)) : undefined;

      // If coordinates are provided, validate them. If not provided, service will return mock/default.
      if ((req.query.lat || req.query.lon) && (Number.isNaN(lat as number) || Number.isNaN(lon as number))) {
        return res.status(400).json({ success: false, message: 'lat and lon query params must be numbers if provided' });
      }

      const result = await weatherService.fetchWeather(lat, lon);

      res.status(200).json({ success: true, data: result && (result as any).forecast ? (result as any).forecast : [], location: result && (result as any).city ? (result as any).city : undefined });
    } catch (error) {
      next(error);
    }
  }
}

export default new WeatherController();
