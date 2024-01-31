/* eslint-disable @typescript-eslint/no-explicit-any */
import { TSales } from './interface.sells';

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

export function groupSalesByWeek(salesData: TSales[]): any {
  const groupedSales = {
    period: 'weekly',
    data: [],
  };

  const salesByWeek = new Map<
    number,
    { totalSales: number; averageQuantity: number }
  >();

  for (const sale of salesData) {
    const weekNumber: number = getWeekNumber(sale.dateOfSales);
    const weekData = salesByWeek.get(weekNumber) || {
      totalSales: 0,
      averageQuantity: 0,
    };
    weekData.totalSales += sale.totalAmount;
    weekData.averageQuantity += sale.quantity;
    salesByWeek.set(weekNumber, weekData);
  }

  for (const [weekNumber, data] of salesByWeek.entries()) {
    groupedSales.data.push({
      week: (weekNumber + 1) as number,
      totalSales: data.totalSales,
      averageQuantity: data.averageQuantity,
    });
  }

  return groupedSales;
}

// group sell by day
export function groupSalesByDay(salesData: TSales[]): any {
  const groupedSales = {
    period: 'daily',
    data: [],
  };

  const salesByDay = new Map<
    number,
    { totalSales: number; averageQuantity: number }
  >();

  for (const sale of salesData) {
    const day = sale.dateOfSales.getDate();
    const dayData = salesByDay.get(day) || {
      totalSales: 0,
      averageQuantity: 0,
    };
    dayData.totalSales += sale.totalAmount;
    dayData.averageQuantity += sale.quantity;
    salesByDay.set(day, dayData);
  }

  for (const [day, data] of salesByDay.entries()) {
    groupedSales.data.push({
      day,
      totalSales: data.totalSales,
      averageQuantity: data.averageQuantity,
    });
  }

  return groupedSales;
}

export function groupSalesByMonth(salesData: TSales[]): any {
  const groupedSales = {
    period: 'monthly',
    data: [],
  };

  const salesByMonth = new Map<
    number,
    { totalSales: number; averageQuantity: number }
  >();

  for (const sale of salesData) {
    const month = sale.dateOfSales.getMonth() + 1;
    const monthData = salesByMonth.get(month) || {
      totalSales: 0,
      averageQuantity: 0,
    };
    monthData.totalSales += sale.totalAmount;
    monthData.averageQuantity += sale.quantity;
    salesByMonth.set(month, monthData);
  }

  for (const [month, data] of salesByMonth.entries()) {
    groupedSales.data.push({
      month,
      totalSales: data.totalSales,
      averageQuantity: data.averageQuantity,
    });
  }

  return groupedSales;
}

export function groupSalesByYear(salesData: TSales[]): any {
  const groupedSales = {
    period: 'yearly',
    data: [],
  };

  const salesByYear = new Map<
    number,
    { totalSales: number; averageQuantity: number }
  >();

  for (const sale of salesData) {
    const year = sale.dateOfSales.getFullYear();
    const yearData = salesByYear.get(year) || {
      totalSales: 0,
      averageQuantity: 0,
    };
    yearData.totalSales += sale.totalAmount;
    yearData.averageQuantity += sale.quantity;
    salesByYear.set(year, yearData);
  }

  for (const [year, data] of salesByYear.entries()) {
    groupedSales.data.push({
      year,
      totalSales: data.totalSales,
      averageQuantity: data.averageQuantity,
    });
  }

  return groupedSales;
}
