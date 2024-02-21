import express from 'express';
import { polishValidationSchema } from './validation.polish';
import validateRequest from '../../middlewares/validateRequest';
import { polishController } from './controller.polish';

const router = express.Router();

router.post(
  '/',
  validateRequest(polishValidationSchema.createPolishValidationSchema),
  polishController.createPolishRequest,
);

router.get('/:polishId', polishController.getPolishRequestStatus);

router.put(
  '/:polishId',
  //  auth('admin'),
  validateRequest(polishValidationSchema.updatePolishValidationSchema),
  polishController.updatePolishRequest,
);
export const polishRoute = router;
