import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { response } from '../../utils/sendResponse';
import { sellsServices } from './service.sells';
// import { Sells } from './model.sells';

// create course
const createOrder: RequestHandler = async (req, res) => {
  // console.log(req.body);
  const result = await sellsServices.createOrder(req.body);

  response.createSendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order created Successfully',
    data: result,
  });
};

// get all course
const getAllOrder = catchAsync(async (req, res) => {
  const timeInterval = req.query.history;
  const result = await sellsServices.getSalesHistory(timeInterval);
  // console.log('c', result.length);

  response.createSendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,

    message: `  Sales retrieved successfully`,
    data: result,
  });
});

export const sellsController = {
  createOrder,
  getAllOrder,
};
