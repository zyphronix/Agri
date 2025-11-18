import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import soilService from '../services/soil.service';

class SoilController {
  async getSoilDataForFarm(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { farmId } = req.params;
      const soilData = await soilService.getSoilDataForFarm(farmId);
      
      res.status(200).json({
        success: true,
        data: soilData,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new SoilController();
