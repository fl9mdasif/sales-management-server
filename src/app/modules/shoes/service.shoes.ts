/* eslint-disable @typescript-eslint/no-explicit-any */
import { TShoes } from './interface.shoes';
import { Shoes } from './model.shoes';
import AppError from '../../errors/AppErrors';
import httpStatus from 'http-status';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';

// create shoes
const createShoes = async (file: any, shoesData: TShoes) => {
  const imageName = `${shoesData?.productName}`;
  const path = file?.path;

  // send Image to cloudinary
  const { secure_url } = (await sendImageToCloudinary(imageName, path)) as {
    secure_url: string;
  };

  const newShoes = {
    ...shoesData,
    coverPhoto: secure_url,
  };

  const result = await Shoes.create(newShoes);

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
const updateCourse = async (id: string, updatedData: Partial<TShoes>) => {
  const { tags, details, ...courseRemainingData } = updatedData;

  // console.log(courseRemainingData);

  // Basic update primitive fields
  const updatedBasicCourseInfo = await Shoes.findOneAndUpdate(
    { _id: id },

    { $set: courseRemainingData },
    { upsert: true, new: true, runValidators: true },
  );

  if (!updatedBasicCourseInfo) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Failed to update basic course',
      '',
    );
  }

  // Update non-primitive fields if available
  if (details) {
    const updatedDetails = await Shoes.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          'details.level': details.level,
          'details.description': details.description,
        },
      },
      { new: true, upsert: true, runValidators: true },
    );

    if (!updatedDetails) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to update details',
        '',
      );
    }
    return updatedDetails;
  }

  // dynamic Update preRequisiteCourse = tags
  if (tags && tags.length > 0) {
    // Filter out the deleted fields
    const deletedTags = tags
      .filter((el) => el.name && el.isDeleted)
      .map((el) => el.name);

    // Remove deleted Tags
    const deletedCourseTags = await Shoes.findByIdAndUpdate(
      id,
      {
        $pull: {
          tags: { name: { $in: deletedTags } },
        },
      },
      { new: true, runValidators: true },
    );

    if (!deletedCourseTags) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course', '');
    }

    // Filter out the new course fields
    const newPreTags = tags?.filter((el) => el.name && !el.isDeleted);

    // console.log(newPreTags);

    const newTags = await Shoes.findByIdAndUpdate(
      id,
      {
        $addToSet: { tags: { $each: newPreTags } },
      },
      {
        upsert: true,
        new: true,
        runValidators: true,
      },
    );

    if (!newTags) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to update  dynamic course',
        '',
      );
    }
  }
  // result
  const result = await Shoes.findById(id).populate('createdBy');
  return result;
};
// getSingleCourseWithReview
const getSingleCourseWithReview = async (id: string) => {
  // console.log(id);

  const singleCourse = await Shoes.findById(id)
    .populate('createdBy', '-password -createdAt -updatedAt -__v')
    .lean();

  // get reviews
  const reviews = await Review.find({ courseId: id })
    .populate(
      'createdBy',
      '-password -createdAt -updatedAt -__v -passwordChangedAt',
    )
    .lean();
  // console.log(reviews);

  const courseWithReviews = { ...singleCourse, reviews: [...reviews] };
  // console.log( courseWithReviews);
  return courseWithReviews;
};

// find best course
const findBestCourse = async () => {
  // console.log(id);

  const bestCourse = await Shoes.aggregate([
    {
      $lookup: {
        from: 'reviews',
        localField: '_id',
        foreignField: 'courseId',
        as: 'reviews',
      },
    },
    {
      $project: {
        title: 1,
        instructor: 1,
        categoryId: 1,
        price: 1,
        tags: 1,
        startDate: 1,
        endDate: 1,
        language: 1,
        provider: 1,
        durationInWeeks: 1,
        details: 1,
        averageRating: { $avg: '$reviews.rating' },
        reviewCount: { $size: '$reviews' },
      },
    },
    {
      $sort: { averageRating: -1 },
    },
  ]);

  if (bestShoes.length > 0) {
    const result = bestCourse[0];
    return result;
  }
};

export const ShoesServices = {
  createShoes,
  getAllShoes,
  deleteShoe,
  getSingleShoe,
  getSingleCourseWithReview,
  findBestCourse,
  updateCourse,
};
