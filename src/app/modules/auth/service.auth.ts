import httpStatus from 'http-status';
import { User } from '../user/mode.user';
import { TLoginUser } from './interface.auth';
import AppError from '../../errors/AppErrors';
import config from '../../config';
import { createToken, verifyToken } from './utils.auth';
import bcrypt from 'bcrypt';
import { JwtPayload } from 'jsonwebtoken';

const loginUser = async (payload: TLoginUser) => {
  //
  // 1. checking if the user is exist
  const user = await User.isUserExists(payload.username);
  // console.log(user);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, '', `This user is not found !'`);
  }

  //   2. checking if the password is correct
  if (!(await User.isPasswordMatched(payload?.password, user?.password)))
    throw new AppError(
      httpStatus.FORBIDDEN,
      `Password of '${user.role}' do not matched`,
      'password',
    );
  // console.log(user);

  // 3. create token and sent to the client
  const jwtPayload = {
    _id: user?._id as string,
    username: user.username,
    email: user.email,
    role: user.role,
  };

  // create token
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  // refresh token
  const refreshToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  return {
    data: { jwtPayload },
    accessToken,
    refreshToken,
  };
};

// change password
const changePassword = async (
  userData: JwtPayload,
  payload: { currentPassword: string; newPassword: string },
) => {
  // 01. checking if the user is exist
  const user = await User.isUserExists(userData.username);
  // console.log(user);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !', '');
  }

  // 02. checking if the password is correct
  if (!(await User.isPasswordMatched(payload.currentPassword, user?.password)))
    throw new AppError(
      httpStatus.FORBIDDEN,
      `${user.role}'s Password do not matched`,
      '',
    );
  // 03 Check if the new password is different from the current password
  if (payload.currentPassword === payload.newPassword) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Password change failed. Ensure the new password is unique and not among the last 2 used',
      '',
    );
    return null;
  }

  // 04 hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_round),
  );

  // update password
  await User.findOneAndUpdate(
    {
      username: userData.username,
      role: userData.role,
    },
    {
      password: newHashedPassword,
      passwordChangedAt: new Date(),
    },
    { new: true, runValidators: true },
  );
  return user;
};

// create refresh token
const refreshToken = async (token: string) => {
  // console.log(token);
  // checking if the given token is valid

  const decoded = verifyToken(
    token,
    config.jwt_access_secret as string,
  ) as JwtPayload;

  const { iat, username } = decoded;

  // checking if the user is exist
  const user = await User.isUserExists(username);
  // console.log(decoded);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }

  if (
    user.passwordChangedAt &&
    User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat as number)
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized !');
  }

  const jwtPayload = {
    username: user.username,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  return {
    accessToken,
  };
};

export const authServices = {
  loginUser,
  changePassword,
  refreshToken,
};
