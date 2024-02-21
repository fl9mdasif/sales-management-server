import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { ShoesValidation } from './validation.shoes';
import { shoesControllers } from './controller.shoes';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/constant.user';

const router = express.Router();

router.post(
  '/create-shoes',
  auth(USER_ROLE.seller, USER_ROLE.superAdmin),
  validateRequest(ShoesValidation.CreateShoesValidationSchema),
  shoesControllers.createShoes,
);

router.get(
  '/',
  auth(USER_ROLE.buyer, USER_ROLE.seller, USER_ROLE.superAdmin),

  shoesControllers.getAllShoes,
);
// get single
router.get(
  '/:shoeId',
  auth(USER_ROLE.buyer, USER_ROLE.seller, USER_ROLE.superAdmin),
  shoesControllers.getSingleShoe,
);
// delete
router.delete(
  '/shoeIds',
  auth(USER_ROLE.superAdmin),
  shoesControllers.deleteShoe,
);

router.put(
  '/:shoeId',
  auth(USER_ROLE.seller, USER_ROLE.superAdmin),

  validateRequest(ShoesValidation.UpdateShoesValidationSchema),
  shoesControllers.updateShoe,
);

router.get(
  '/verify/:shoeId',
  auth(USER_ROLE.buyer),
  shoesControllers.verifyProduct,
);

export const shoesRoute = router;
