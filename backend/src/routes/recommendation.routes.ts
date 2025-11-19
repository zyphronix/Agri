import { Router } from 'express';
import recommendationController from '../controllers/recommendation.controller';
import { validate } from '../middleware/validate';
import { authMiddleware } from '../middleware/auth.middleware';
import { recommendationSchema } from '../validations/recommendation.validation';

const router = Router();

router.post(
  '/',
  authMiddleware,
  validate(recommendationSchema),
  recommendationController.getRecommendations
);

// Seasonal climate aggregates for recommendation page
router.get('/seasonal', authMiddleware, recommendationController.getSeasonalClimate);

export default router;
