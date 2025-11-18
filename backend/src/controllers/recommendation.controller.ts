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
}

export default new RecommendationController();
