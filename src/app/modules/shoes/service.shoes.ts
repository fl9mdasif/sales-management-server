/* eslint-disable @typescript-eslint/no-explicit-any */
import { TShoes } from './interface.shoes';
import { Shoes } from './model.shoes';
import AppError from '../../errors/AppErrors';
import httpStatus from 'http-status';

// create shoes
const createShoes = async (shoesData: TShoes) => {
  const result = await Shoes.create(shoesData);
  return result;
};

// get all shoes
const getAllShoes = async (payload: Record<string, unknown>) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = 'startDate',
      sortOrder = 'asc',
      minPrice,
      maxPrice,
      releasedAt,
      productName,
      brand,
      model,
      size,
      category,
      color,
      gender,
      rawMaterial,
    } = payload;

    //  filter object based on query parameters
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = {};

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(String(minPrice));
      if (maxPrice) filter.price.$lte = parseFloat(String(maxPrice));
    }

    if (releasedAt) {
      const releaseDate = new Date(releasedAt as string);

      // Check if the parsed date is valid
      if (!isNaN(releaseDate.getTime())) {
        // Filter documents where createdAt is greater than or equal to releaseDate
        filter.createdAt = { $gte: releaseDate };
      }
    }

    if (productName)
      filter.productName = { $regex: new RegExp(productName as string, 'i') };
    if (brand) filter.brand = { $regex: new RegExp(brand as string, 'i') };
    if (model) filter.model = { $regex: new RegExp(model as string, 'i') };
    if (size) filter.size = { $regex: new RegExp(size as string, 'i') };
    if (gender) filter.gender = { $regex: new RegExp(gender as string, 'i') };
    if (color) filter.color = { $regex: new RegExp(color as string, 'i') };
    if (rawMaterial)
      filter.rawMaterial = { $regex: new RegExp(rawMaterial as string, 'i') };
    if (category)
      filter.category = { $regex: new RegExp(category as string, 'i') };

    // sort order && sort by
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sort: Record<string, any> = {};
    sort[sortBy as string] = sortOrder === 'asc' ? 1 : -1;

    // calculate skip value for pagination
    const skip = (parseInt(String(page)) - 1) * parseInt(String(limit));

    const result = await Shoes.find(filter)
      // .populate('createdBy', '-password -createdAt -updatedAt')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(String(limit)));

    return result;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    throw new Error(err);
  }
};

// getSingle shoe
const getSingleShoe = async (id: string) => {
  const singleShoe = await Shoes.findById({ _id: id });

  return singleShoe;
};

// delete shoes
const deleteShoe = async (id: string) => {
  // get reviews
  const deleteShoe = await Shoes.findByIdAndDelete({ _id: id });
  return deleteShoe;
};

// update course
const updateShoe = async (id: string, updatedData: Partial<TShoes>) => {
  const { ...shoeData } = updatedData;

  // console.log(courseRemainingData);

  // Basic update primitive fields
  const updatedBasicShoeInfo = await Shoes.findOneAndUpdate(
    { _id: id },

    { $set: shoeData },
    { upsert: true, new: true, runValidators: true },
  );

  if (!updatedBasicShoeInfo) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Failed to update basic course',
      '',
    );
  }

  const result = await Shoes.findById({ _id: id });
  // console.log('object', result);
  return result;
};

export const ShoesServices = {
  createShoes,
  getAllShoes,
  deleteShoe,
  getSingleShoe,
  updateShoe,
};
