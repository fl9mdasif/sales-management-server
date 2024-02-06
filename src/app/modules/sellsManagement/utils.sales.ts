/* eslint-disable no-unused-vars */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { TSales } from './interface.sells';

import { TSales } from './interface.sells';
import { TResult } from './service.sells';

function getWeekNumber(date: Date): number {
  const target = new Date(date.valueOf());
  const dayNr = (date.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = target.valueOf();
  target.setMonth(0, 1);
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7));
  }
  return Math.ceil((firstThursday - target.valueOf()) / 604800000);
}

// export function groupSalesByWeek(salesData: TSales[]): any {

// Function for determining the grouping key
function getGroupingKey(date: Date, period: GroupingPeriod): number {
  switch (period) {
    case 'daily':
      return date.getDate();
    case 'weekly':
      return getWeekNumber(date);
    case 'monthly':
      return date.getMonth() + 1;
    case 'yearly':
      return date.getFullYear();
    default:
      throw new Error(`Invalid grouping period: ${period}`);
  }
}

export enum GroupingPeriod {
  Weekly = 'weekly',
  Daily = 'daily',
  Monthly = 'monthly',
  Yearly = 'yearly',
}
// Reusable function for grouping sales
export function groupSales<T extends GroupingPeriod>(
  salesData: TSales[],
  period: T,
): { period: T; data: TResult[] } {
  // Adjust return type to TResult[]
  const groupedSales: { period: T; data: TResult[] } = {
    period,
    data: [],
  };

  const salesByPeriod = new Map<
    number,
    { totalSales: number; averageQuantity: number }
  >();

  for (const sale of salesData) {
    const key = getGroupingKey(sale.dateOfSales, period);
    const periodData = salesByPeriod.get(key) || {
      totalSales: 0,
      averageQuantity: 0,
    };
    periodData.totalSales += sale.totalAmount as number;
    periodData.averageQuantity += sale.quantity;
    salesByPeriod.set(key, periodData);
  }

  for (const [key, data] of salesByPeriod.entries()) {
    groupedSales.data.push({
      period: key, // Explicitly add the "period" property
      totalSales: data.totalSales,
      averageQuantity: data.averageQuantity,
    });
  }

  return groupedSales;
}
