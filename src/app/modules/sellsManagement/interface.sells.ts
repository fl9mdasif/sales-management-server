import { Model, Types } from 'mongoose';

export interface TSales {
  productId: Types.ObjectId;

  buyer: string;
  quantity: number;
  totalAmount?: number;
  dateOfSales: Date;
}

export interface SalesModel extends Model<TSales> {
  //instance methods for checking if the user exist
  // eslint-disable-next-line no-unused-vars
  isShoeExists(id: string): Promise<TSales>;
  //instance methods for checking if passwords are matched
}
