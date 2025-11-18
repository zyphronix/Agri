import { Router } from 'express';
import authRoutes from './auth.routes';
import farmRoutes from './farm.routes';
import weatherRoutes from './weather.routes';
import soilRoutes from './soil.routes';
import recommendationRoutes from './recommendation.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/farms', farmRoutes);
router.use('/weather', weatherRoutes);
router.use('/soil', soilRoutes);
router.use('/recommendations', recommendationRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

export default router;
