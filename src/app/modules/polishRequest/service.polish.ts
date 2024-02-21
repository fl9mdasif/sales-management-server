import { TPolish } from './interface.polish';
import { ShoePolish } from './model.polish';
import AppError from '../../errors/AppErrors';
import httpStatus from 'http-status';

const createPolishRequest = async (data: TPolish) => {
  const result = await ShoePolish.create(data);
  return result;
};

// getSingle shoe
const getPolishRequestStatus = async (id: string) => {
  const singleShoe = await ShoePolish.findById({ _id: id });

  return singleShoe;
};

// update
const updatePolishRequest = async (
  id: string,
  updatedData: Partial<TPolish>,
) => {
  // Basic update primitive fields
  const updatedResult = await ShoePolish.findOneAndUpdate(
    { _id: id },

    { $set: updatedData },
    { upsert: true, new: true, runValidators: true },
  );

  if (!updatedResult) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Failed to update polish request',
      'update polish',
    );
  }

  const result = await ShoePolish.findById({ _id: id });
  // console.log('res', result);
  return result;
};

export const polishServices = {
  createPolishRequest,
  getPolishRequestStatus,
  updatePolishRequest,
};
