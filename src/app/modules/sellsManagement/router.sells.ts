import express from 'express';
import { salesValidationSchema } from './validation.sells';
import validateRequest from '../../middlewares/validateRequest';
import { sellsController } from './controller.sells';

const router = express.Router();

router.post(
  '/',
  //   auth('admin'),

  validateRequest(salesValidationSchema),
  sellsController.createOrder,
);

router.get(
  '/sales-history',
  // auth(USER_ROLE.admin),
  sellsController.getAllOrder,
);

export const sellsRoute = router;
