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
  auth('admin'),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = JSON.parse(req.body.data);
    } catch (error) {
      res.status(400).json({ error: 'Invalid JSON data' });
      return;
    }
    next();
  },
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
router.delete('/:shoeId', shoesControllers.deleteShoe);

router.get('/best', shoesControllers.findBestCourse);

router.put(
  '/:shoeId',
  //  auth('admin'),
  validateRequest(ShoesValidation.UpdateShoesValidationSchema),
  shoesControllers.updateShoe,
);

router.get('/:courseId/reviews', shoesControllers.getSingleCourseWithReview);
router.get('/best', shoesControllers.findBestCourse);

export const shoesRoute = router;
