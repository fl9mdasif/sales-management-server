import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { ShoesValidation } from './validation.shoes';
import { shoesControllers } from './controller.shoes';

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

router.get('/verify/:shoeId', shoesControllers.verifyProduct);

export const shoesRoute = router;
