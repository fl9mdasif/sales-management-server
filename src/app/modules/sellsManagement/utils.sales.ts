import { TSells } from './interface.sells';

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

export function groupSalesByWeek(salesData: TSells[]): any {
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
