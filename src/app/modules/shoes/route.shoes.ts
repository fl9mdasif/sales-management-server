import express, { NextFunction, Request, Response } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import {   ShoesValidation } from './validation.shoes';
import { shoesControllers } from './controller.shoes';
import auth from '../../middlewares/auth';
import { upload } from '../../utils/sendImageToCloudinary';

const router = express.Router();

router.post(
  '/create-shoes',
  // auth('admin'),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = JSON.parse(req.body.data);
    } catch (error) {
      console.error('Error parsing JSON:', error);
      // Handle the error appropriately, e.g., send a response with an error status
      res.status(400).json({ error: 'Invalid JSON data' });
      return;
    }
    next();
  },
  // validateRequest(ShoesValidation.CreateShoesValidationSchema),
  shoesControllers.createShoes,
);

router.get('/', auth('admin'), shoesControllers.getAllCourse);
router.get('/best', shoesControllers.findBestCourse);

router.put('/:courseId', auth('admin'), shoesControllers.updateCourse);


router.get('/:courseId/reviews', shoesControllers.getSingleCourseWithReview);
router.get('/best', shoesControllers.findBestCourse);

export const shoesRoute = router;
