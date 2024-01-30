import { Model, Types } from 'mongoose';

export interface TSells {
  sellId: Types.ObjectId;

  buyer: string;
  quantity: number;
  totalAmount?: number;
  dateOfSales: Date;
}

export interface SellsModel extends Model<TSells> {
  //instance methods for checking if the user exist
  // eslint-disable-next-line no-unused-vars
  isShoeExists(id: string): Promise<TSells>;
  //instance methods for checking if passwords are matched
}
