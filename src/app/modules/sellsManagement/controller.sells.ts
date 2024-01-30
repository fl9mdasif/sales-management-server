import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { ShoesServices } from '../shoes/service.shoes';
import { response } from '../../utils/sendResponse';
import { Shoes } from '../shoes/model.shoes';
import { sellsServices } from './service.sells';

// create course
const createOrder: RequestHandler = async (req, res) => {
  //   console.log(req.body);
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

export const sellsController = {
  createOrder,
  getAllOrder,
};
