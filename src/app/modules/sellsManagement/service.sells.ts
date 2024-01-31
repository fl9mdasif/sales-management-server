/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../errors/AppErrors';
import { Shoes } from '../shoes/model.shoes';
import { TSales } from './interface.sells';
import { Sales } from './model.sells';
import {
  groupSalesByWeek,
  groupSalesByDay,
  groupSalesByMonth,
  groupSalesByYear,
} from './utils.sales';

// create sales
const createOrder = async (orderData: TSales) => {
  //   console.log('service', orderData);
  try {
    // find product
    const product = await Shoes.findById({ _id: orderData.productId });

    // check product is available
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

    // If the quantity reaches zero, the product will be removed from the inventory.
    // If quantity reaches zero, consider removing the product
    if (product.quantity == 0) {
      // console.log('product nai');
      await Shoes.findByIdAndDelete({ _id: orderData.productId });
    } else {
      //   console.log(updateQuantity);
      await product.save();
    }

    // check the product quantity is available for sell
    if (product.quantity < orderData.quantity) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Decrease Your quantity for sell. we have only ${product.quantity}`,
        // 'quantity',
      );
    }

    // Basic update primitive fields
    // update product quantity after order
    await Shoes.findOneAndUpdate(
      { _id: orderData.productId },

      { $set: { quantity: product.quantity - orderData.quantity } },
      { upsert: true, new: true, runValidators: true },
    );

    const result = await Sales.create(orderDataWithTotalAmount);
    return result;
  } catch (err) {
    // throw new AppError(
    //   httpStatus.NOT_FOUND,
    //   'Product is is not enough to sell',
    // );
    console.log(err);
  }
};

// get sales history
export async function getSalesHistory(timeInterval: string): Promise<any> {
  const salesData: TSales[] = await Sales.find();

  type TResult = {
    week: number;
    totalSales: number;
    averageQuantity: number;
  };

  type TGroupedSales = {
    period: string;
    data: TResult[];
  };

  const groupedSales: TGroupedSales[] = [];
  //   console.log(groupedSales);

  //   console.log(groupSalesByWeek(salesData));

  switch (timeInterval) {
    case 'weekly':
      groupedSales.push({
        period: 'weekly',
        data: groupSalesByWeek(salesData).data,
      });
      break;
    case 'daily':
      groupedSales.push({
        period: 'daily',
        data: groupSalesByDay(salesData).data,
      });
      break;
    case 'monthly':
      groupedSales.push({
        period: 'monthly',
        data: groupSalesByMonth(salesData).data,
      });
      break;
    case 'yearly':
      groupedSales.push({
        period: 'yearly',
        data: groupSalesByYear(salesData).data,
      });
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
