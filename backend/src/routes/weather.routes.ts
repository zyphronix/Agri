import { Router } from 'express';
import weatherController from '../controllers/weather.controller';
import { authMiddleware } from '../middleware/auth.middleware';


const router = Router();

// GET /api/weather?lat=..&lon=.. -> fetch weather by coordinates
router.get('/', authMiddleware, weatherController.getWeatherByCoords);

// GET /api/weather/:farmId -> fetch weather based on farm location
router.get('/:farmId', authMiddleware, weatherController.getWeatherForFarm);

export default router;
