import httpStatus from 'http-status';
import AppError from '../../errors/AppErrors';
import { Shoes } from '../shoes/model.shoes';
import { TSells } from './interface.sells';
import { Sells } from './model.sells';
import { TSells } from './interface.sells'; // Adjust the import path based on your project structure
import {
  groupSalesByWeek,
  groupSalesByDay,
  groupSalesByMonth,
  groupSalesByYear,
} from './utils.sales'; // Implement utility functions for grouping sales data

// create shoes
const createOrder = async (orderData: TSells) => {
  //   console.log('service', orderData);

  // find product
  const product = await Shoes.findById({ _id: orderData.sellId });

  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, 'product not found');
  }

  // order total price
  const totalAmount = orderData.quantity * (product?.price as number);

  // create oder data with total price
  const orderDataWithTotalAmount = {
    ...orderData,
    totalAmount,
  };

  // Basic update primitive fields
  // update product quantity after order

  await Shoes.findOneAndUpdate(
    { _id: orderData.sellId },

    { $set: { quantity: product.quantity - orderData.quantity } },
    { upsert: true, new: true, runValidators: true },
  );

  // If the quantity reaches zero, the product will be removed from the inventory.

  //   console.log(updateQuantity);
  const result = await Sells.create(orderDataWithTotalAmount);

  return result;
};

// get all shoes
// const getAllOrder = async (payload: Record<string, unknown>) => {
//   try {
//     const {
//       page = 1,
//       limit = 10,
//       sortBy = 'startDate',
//       sortOrder = 'asc',
//       minPrice,
//       maxPrice,
//       releasedAt,

//       brand,
//       model,
//       size,
//       category,
//       color,
//       gender,
//       rawMaterial,
//     } = payload;

//     //  filter object based on query parameters
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     const filter: any = {};

//     if (minPrice || maxPrice) {
//       filter.price = {};
//       if (minPrice) filter.price.$gte = parseFloat(String(minPrice));
//       if (maxPrice) filter.price.$lte = parseFloat(String(maxPrice));
//     }

//     if (releasedAt) {
//       const releaseDate = new Date(releasedAt as string);

//       // Check if the parsed date is valid
//       if (!isNaN(releaseDate.getTime())) {
//         // Filter documents where createdAt is greater than or equal to releaseDate
//         filter.createdAt = { $gte: releaseDate };
//       }
//     }

//     if (brand) filter.brand = { $regex: new RegExp(brand as string, 'i') };
//     if (model) filter.model = { $regex: new RegExp(model as string, 'i') };
//     if (size) filter.size = { $regex: new RegExp(size as string, 'i') };
//     if (gender) filter.gender = { $regex: new RegExp(gender as string, 'i') };
//     if (color) filter.color = { $regex: new RegExp(color as string, 'i') };
//     if (rawMaterial)
//       filter.rawMaterial = { $regex: new RegExp(rawMaterial as string, 'i') };
//     if (category)
//       filter.category = { $regex: new RegExp(category as string, 'i') };

//     // sort order && sort by
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     const sort: Record<string, any> = {};
//     sort[sortBy as string] = sortOrder === 'asc' ? 1 : -1;

//     // calculate skip value for pagination
//     const skip = (parseInt(String(page)) - 1) * parseInt(String(limit));

//     const result = await Sells.find(filter)
//       // .populate('createdBy', '-password -createdAt -updatedAt')
//       .sort(sort)
//       .skip(skip)
//       .limit(parseInt(String(limit)));

//     // Group by week
//     const getWeekNumber = (date: Date): number => {
//       const d = new Date(date);
//       d.setHours(0, 0, 0, 0);
//       d.setDate(d.getDate() + 4 - (d.getDay() || 7));
//       const yearStart: Date = new Date(d.getFullYear(), 0, 1);
//       const weekNumber = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
//       return weekNumber;
//     };

//     const weekNumber = getWeekNumber(new Date());

//     // Now, you can use weekNumber in arithmetic operations
//     const week = weekNumber + 1;

//     console.log('sells week', week);

//     return result;
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   } catch (err: any) {
//     throw new Error(err);
//   }
// };

export async function getSalesHistory(timeInterval: string): Promise<any> {
  const salesData: TSells[] = await Sells.find();

  type TResult = {
    week: number;
    totalSales: number;
    averageQuantity: number;
  };

  type TGroupedSales = {
    period: string;
    data: TResult[];
  };

  let groupedSales: TGroupedSales[] = [];
  console.log(groupedSales);

  //   console.log(groupSalesByWeek(salesData));

  switch (timeInterval) {
    case 'Weekly':
      groupedSales.push({
        period: 'weekly',
        data: groupSalesByWeek(salesData).data,
      });
      break;
    case 'Daily':
      groupedSales = groupSalesByDay(salesData);
      break;
    case 'Monthly':
      groupedSales = groupSalesByMonth(salesData);
      break;
    case 'Yearly':
      groupedSales = groupSalesByYear(salesData);
      break;
    default:
      return salesData;
  }

  return groupedSales;
}

export const sellsServices = {
  createOrder,
  getSalesHistory,
};
