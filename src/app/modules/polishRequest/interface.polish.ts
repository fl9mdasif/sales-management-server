/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';
import { TUser } from '../user/interface.user';

export type TPolish = {
  userId: Types.ObjectId;
  polishType: 'cream' | 'wax' | 'liquid';
  shineLevel: 'matte ' | 'gloss' | 'high-gloss';
  instructions?: string;
  status: 'pending' | 'in-progress' | 'completed';
};

export interface PolishModel extends Model<TPolish> {
  isUserExist(id: string): Promise<TUser>;
}
