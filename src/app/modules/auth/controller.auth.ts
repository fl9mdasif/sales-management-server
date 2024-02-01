import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { response } from '../../utils/sendResponse';
import { authServices } from './service.auth';
import config from '../../config';

const loginUser = catchAsync(async (req, res) => {
  const result = await authServices.loginUser(req.body);

  const { data, accessToken, refreshToken } = result;

  // console.log(accessToken, refreshToken);
  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
  });

  response.createSendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User login successfully!',
    data: {
      user: data.jwtPayload,
      token: accessToken,
    },
  });
});

// // change password
const changePassword = catchAsync(async (req, res) => {
  const { ...passwordData } = req.body;
  // console.log(req.user);
  const result = await authServices.changePassword(req.user, passwordData);

  response.createSendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password is updated successfully!',
    data: {
      data: result,
    },
  });
});

// refresh
const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;

  // console.log('r', refreshToken);
  const result = await authServices.refreshToken(refreshToken);

  response.createSendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Refresh token is retrieved successfully!',
    data: result,
  });
});

export const authControllers = {
  loginUser,
  changePassword,
  refreshToken,
};
