import { Router } from 'express';
import farmController from '../controllers/farm.controller';
import { validate } from '../middleware/validate';
import { authMiddleware } from '../middleware/auth.middleware';
import {
  createFarmSchema,
  updateFarmSchema,
  farmIdSchema,
} from '../validations/farm.validation';

const router = Router();

// All farm routes require authentication
router.use(authMiddleware);

router.post('/', validate(createFarmSchema), farmController.createFarm);
router.get('/', farmController.getUserFarms);
router.get('/:id', validate(farmIdSchema), farmController.getFarmById);
router.put('/:id', validate(updateFarmSchema), farmController.updateFarm);
router.delete('/:id', validate(farmIdSchema), farmController.deleteFarm);

export default router;
