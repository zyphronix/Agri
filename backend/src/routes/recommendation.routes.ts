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

export default router;
