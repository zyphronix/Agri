import { Router } from 'express';
import soilController from '../controllers/soil.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.get('/:farmId', authMiddleware, soilController.getSoilDataForFarm);

export default router;
