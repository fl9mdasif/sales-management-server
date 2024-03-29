/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../errors/AppErrors';
import { Shoes } from '../shoes/model.shoes';
import { TSales } from './interface.sells';
import { Sales } from './model.sells';
import { GroupingPeriod, groupSales } from './utils.sales';

const createOrder = async (orderData: TSales) => {
  try {
    const product = await Shoes.findById({ _id: orderData.productId });

    if (!product) {
      throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
    }

    const totalAmount = orderData.quantity * (product?.price as number);
    const orderDataWithTotalAmount = {
      ...orderData,
      totalAmount,
    };

    if (product.quantity === 0) {
      await Shoes.findByIdAndDelete({ _id: orderData.productId });
    }

    if (orderData.quantity > product.quantity) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        `Decrease your quantity for sell. We have only ${product.quantity}`,
        'quantity',
      );
    }

    // Update product quantity
    await Shoes.findOneAndUpdate(
      { _id: orderData.productId },
      { $set: { quantity: product.quantity - orderData.quantity } },
      { upsert: true, new: true, runValidators: true },
    );

    // Create order
    const result = await Sales.create(orderDataWithTotalAmount);

    // console.log('Updated Product:', updatedProduct);
    // console.log('Order Result:', result);

    return result;
  } catch (err) {
    return false;
    // console.log(er);
    // Re-throw the error to handle it elsewhere if needed
  }
};

// get sales history
export type TResult = {
  period: number;
  totalSales: number;
  averageQuantity: number;
};

export type TGroupedSales = {
  period?: string;
  data: TResult[];
};

async function getSalesHistory(timeInterval: string): Promise<TGroupedSales[]> {
  const salesData: TSales[] = await Sales.find();

  // Typecast or use a type assertion if necessary:
  const period = timeInterval as GroupingPeriod;

  const groupedSales: TGroupedSales[] = [
    {
      period,
      data: await groupSales(salesData, period).data,
    },
  ];

  return groupedSales;
}
export const sellsServices = {
  createOrder,
  getSalesHistory,
};
