import express from 'express';
import { polishValidationSchema } from './validation.polish';
import validateRequest from '../../middlewares/validateRequest';
import { polishController } from './controller.polish';
// import auth from '../../middlewares/auth';
// import { USER_ROLE } from '../user/constant.user';

const router = express.Router();

router.post(
  '/',
  // auth(USER_ROLE.buyer),
  validateRequest(polishValidationSchema.createPolishValidationSchema),
  polishController.createPolishRequest,
);

router.get('/', polishController.getPolishRequestStatus);
// router.get('/', polishController.getPolishRequestStatus);

router.put(
  '/:polishId',
  // auth(USER_ROLE.seller, USER_ROLE.superAdmin),
  validateRequest(polishValidationSchema.updatePolishValidationSchema),
  polishController.updatePolishRequest,
);
export const polishRoute = router;
