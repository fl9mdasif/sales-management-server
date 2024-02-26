import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { response } from '../../utils/sendResponse';
import { polishServices } from './service.polish';

const createPolishRequest: RequestHandler = async (req, res) => {
  // console.log(req.body);
  const result = await polishServices.createPolishRequest(req.body);

  response.createSendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Successfully send request for shoe Polish',
    data: result,
  });
};

// get all course
const getPolishRequestStatus = catchAsync(async (req, res) => {
  // const { polishId } = req.params;

  const result = await polishServices.getPolishRequestStatus();

  response.createSendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,

    message: `Successfully get polish status`,
    data: result,
  });
});

// updatePolishRequest
const updatePolishRequest = catchAsync(async (req, res) => {
  const { polishId } = req.params;

  const updatedData = req.body;

  const result = await polishServices.updatePolishRequest(
    polishId,
    updatedData,
  );

  response.createSendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'polish Request updated successfully',
    data: result,
  });
});

export const polishController = {
  createPolishRequest,
  getPolishRequestStatus,
  updatePolishRequest,
};
