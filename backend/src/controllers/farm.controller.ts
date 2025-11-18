import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import farmService from '../services/farm.service';

class FarmController {
  async createFarm(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      const farm = await farmService.createFarm(req.user.id, req.body);
      
      res.status(201).json({
        success: true,
        data: farm,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserFarms(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      const farms = await farmService.getUserFarms(req.user.id);
      
      res.status(200).json({
        success: true,
        data: farms,
      });
    } catch (error) {
      next(error);
    }
  }

  async getFarmById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      const farm = await farmService.getFarmById(req.params.id, req.user.id);
      
      res.status(200).json({
        success: true,
        data: farm,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateFarm(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      const farm = await farmService.updateFarm(
        req.params.id,
        req.user.id,
        req.body
      );
      
      res.status(200).json({
        success: true,
        data: farm,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteFarm(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      const result = await farmService.deleteFarm(req.params.id, req.user.id);
      
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new FarmController();
