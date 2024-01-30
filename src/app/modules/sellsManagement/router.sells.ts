import express from 'express';
import { SellValidationSchema } from './validation.sells';
import validateRequest from '../../middlewares/validateRequest';
import { shoesControllers } from '../shoes/controller.shoes';

const router = express.Router();

router.post(
  '/',
  //   auth('admin'),

  validateRequest(SellValidationSchema),
  shoesControllers.createShoes,
);

router.get(
  '/',
  // auth(USER_ROLE.admin),
  shoesControllers.getAllShoes,
);
// get single
router.get('/:shoeId', shoesControllers.getSingleShoe);

export const sellsRoute = router;
