import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import recommendationService from '../services/recommendation.service';

class RecommendationController {
  async getRecommendations(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { farmId } = req.body;
      const recommendations = await recommendationService.getCropRecommendations(farmId);
      
      res.status(200).json({
        success: true,
        data: recommendations,
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/recommendations/seasonal?farmId=... or ?lat=..&lon=..
  async getSeasonalClimate(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { farmId } = req.query as any;
      const lat = req.query.lat ? Number(req.query.lat) : undefined;
      const lon = req.query.lon ? Number(req.query.lon) : undefined;

      let result: any;
      if (farmId) {
        result = await recommendationService.getSeasonalClimateForFarm(farmId);
      } else if (typeof lat === 'number' && typeof lon === 'number' && !isNaN(lat) && !isNaN(lon)) {
        result = await recommendationService.fetchSeasonalClimate(lat, lon);
      } else {
        return res.status(400).json({ success: false, message: 'Provide farmId or lat & lon' });
      }

      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

export default new RecommendationController();
