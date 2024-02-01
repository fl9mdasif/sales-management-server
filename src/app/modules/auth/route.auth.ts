import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { userControllers } from '../user/controller.user';
import { userZodValidationSchema } from '../user/validation.user';
import { authValidations } from './validation.auth';
import { authControllers } from './controller.auth';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/constant.user';

const router = express.Router();

// register a user
router.post(
  '/register',
  // auth('admin'),
  validateRequest(userZodValidationSchema.userRegistrationValidation),
  userControllers.registerUser,
);

// login a user
router.post(
  '/login',
  validateRequest(authValidations.loginValidationSchema),
  authControllers.loginUser,
);

// change password
router.post(
  '/change-password',
  auth(USER_ROLE.user),
  validateRequest(authValidations.changePasswordValidationSchema),
  authControllers.changePassword,
);

// refresh token
router.post(
  '/refresh-token',
  validateRequest(authValidations.refreshTokenValidationSchema),
  authControllers.refreshToken,
);
export const authRoute = router;
