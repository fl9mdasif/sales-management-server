import express from 'express';
import { salesValidationSchema } from './validation.sells';
import validateRequest from '../../middlewares/validateRequest';
import { shoesControllers } from '../shoes/controller.shoes';
import { sellsController } from './controller.sells';

const router = express.Router();

router.post(
  '/',
  //   auth('admin'),

  validateRequest(salesValidationSchema),
  sellsController.createOrder,
);

router.get(
  '/',
  // auth(USER_ROLE.admin),
  sellsController.getAllOrder,
);
// get single
router.get('/:shoeId', shoesControllers.getSingleShoe);

export const sellsRoute = router;
