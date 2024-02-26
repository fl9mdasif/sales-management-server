import express from 'express';
import { salesValidationSchema } from './validation.sells';
import validateRequest from '../../middlewares/validateRequest';
import { sellsController } from './controller.sells';
// import { USER_ROLE } from '../user/constant.user';
// import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
  '/',
  // auth(USER_ROLE.seller, USER_ROLE.superAdmin),
  validateRequest(salesValidationSchema),
  sellsController.createOrder,
);

router.get(
  '/sales-history',
  // auth(USER_ROLE.seller, USER_ROLE.superAdmin),
  sellsController.getAllOrder,
);

export const sellsRoute = router;
