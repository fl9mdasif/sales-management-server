import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { ShoesServices } from './service.shoes';
import { response } from '../../utils/sendResponse';
import { RequestHandler } from 'express';
import { Shoes } from './model.shoes';

// create course
const createShoes: RequestHandler = async (req, res) => {
  const result = await ShoesServices.createShoes(req.file, req.body);

  response.createSendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product created Successfully',
    data: result,
  });
};

// get all course
const getAllShoes = catchAsync(async (req, res) => {
  const result = await ShoesServices.getAllShoes(req.query);

  // Get the total number of documents
  let total = 0;

  const page = req.query.page;
  const limit = req.query.limit;

  // show total if limit query not used
  if (!req.query) {
    const res = await Shoes.find();
    total = res.length;
  } else {
    total = result.length;
  }

  response.getSendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    meta: {
      page: Number(page ? page : 1),
      limit: Number(limit ? limit : 10),
      total: Number(total),
      // total: 0,
    },
    message: 'Shoes retrieved successfully',
    data: result,
  });
});
// delete shoe
const deleteShoe = catchAsync(async (req, res) => {
  const { shoeId } = req.params;
  // console.log({ courseId });

  await ShoesServices.deleteShoe(shoeId);

  response.createSendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Shoe deleted successfully',
    data: null,
  });
});

// Get singleShoe
const getSingleShoe = catchAsync(async (req, res) => {
  const { shoeId } = req.params;

  const result = await ShoesServices.getSingleShoe(shoeId);

  response.createSendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Shoe retrieved successfully',
    data: result,
  });
});

// update course
const updateShoe = catchAsync(async (req, res) => {
  const { shoeId } = req.params;
  const updatedData = req.body;

  const result = await ShoesServices.updateShoe(shoeId, updatedData);
  // console.log('res', result);

  response.createSendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course updated successfully',
    data: result,
  });
});

// Get single course with reviews
const getSingleCourseWithReview = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  // console.log({ courseId });

  const course = await ShoesServices.getSingleCourseWithReview(courseId);
  response.createSendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course and Reviews retrieved successfully',
    data: { course },
  });
});

// findBestCourse
const findBestCourse = catchAsync(async (req, res) => {
  const course = await ShoesServices.findBestCourse();
  response.createSendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Best course retrieved successfully',
    data: { course },
  });
});

export const shoesControllers = {
  createShoes,
  getAllShoes,
  deleteShoe,
  getSingleShoe,
  updateShoe,
  getSingleCourseWithReview,
  findBestCourse,
};
