import express, { NextFunction, Request, Response } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { ShoesValidation } from './validation.shoes';
import { shoesControllers } from './controller.shoes';
import auth from '../../middlewares/auth';
import { upload } from '../../utils/sendImageToCloudinary';
import { USER_ROLE } from '../user/constant.user';

const router = express.Router();

router.post(
  '/create-shoes',

  validateRequest(ShoesValidation.CreateShoesValidationSchema),
  shoesControllers.createShoes,
);

router.get(
  '/',
  // auth(USER_ROLE.admin),
  shoesControllers.getAllShoes,
);
// get single
router.get('/:shoeId', shoesControllers.getSingleShoe);
// delete
router.delete('/shoeIds', shoesControllers.deleteShoe);

router.put(
  '/:shoeId',
  //  auth('admin'),
  validateRequest(ShoesValidation.UpdateShoesValidationSchema),
  shoesControllers.updateShoe,
);

export const shoesRoute = router;
