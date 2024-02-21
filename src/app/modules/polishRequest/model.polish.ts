import { Schema, model } from 'mongoose';
import { PolishModel, TPolish } from './interface.polish';
import { User } from '../user/mode.user';

const polishSchema = new Schema<TPolish, PolishModel>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },

    polishType: {
      type: String,
      required: true,
    },
    shineLevel: {
      type: String,
      required: true,
    },
    instructions: {
      type: String,
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'],
      default: 'pending',
    },
  },

  { timestamps: true },
);

polishSchema.statics.isUserExist = async function (id: string) {
  return await User.findOne({ id });
};

export const ShoePolish = model<TPolish, PolishModel>(
  'ShoePolish',
  polishSchema,
);
