import { Schema, model } from 'mongoose';
import { TSales, SalesModel } from './interface.sells';
import { Shoes } from '../shoes/model.shoes';

const salesSchema = new Schema<TSales, SalesModel>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Shoes',
    },
    buyer: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
    },

    dateOfSales: { type: Date, required: true },
  },

  { timestamps: true },
);

// hash the password
// hash the password
// userSchema.pre('save', async function (next) {
//   // eslint-disable-next-line @typescript-eslint/no-this-alias
//   const user = this;

//   // Store hash in your password DB.

//   user.password = await bcrypt.hash(
//     user.password,
//     Number(config.bcrypt_salt_round),
//   );
//   next();
// });

// for auth
// find user exists
salesSchema.statics.isShoeExists = async function (id: string) {
  return await Shoes.findOne({ id });
};

export const Sales = model<TSales, SalesModel>('Sales', salesSchema);
