import { Shoes } from './model.shoes';

// Define a function to calculate the duration in weeks
export const calculateDurationInWeeks = (
  startDate: string | number | Date,
  endDate: string | number | Date,
) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const timeDifference = Math.abs(end.getTime() - start.getTime());
  const durationInWeeks = Math.ceil(timeDifference / (1000 * 60 * 60 * 24 * 7));
  return durationInWeeks;
};

const findLastShoesId = async () => {
  const lastShoes = await Shoes.findOne({}, { id: 1, _id: 0 })
    .sort({ id: -1 })
    .lean();

  return lastShoes?.id;
};

export const generateShoesId = async () => {
  try {
    const lastShoesId = await findLastShoesId();

    // Default ID if no existing records
    const currentId = lastShoesId ? parseInt(lastShoesId, 10) + 1 : 1;

    const formattedId = currentId.toString().padStart(4, '0');

    return formattedId;
  } catch (error) {
    // console.error('Error generating shoes ID:', error);
    throw new Error(error);
  }
};
