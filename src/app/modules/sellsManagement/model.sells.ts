import { Schema, model } from 'mongoose';
import { TSells, SellsModel } from './interface.sells';
import { Shoes } from '../shoes/model.shoes';

const sellsSchema = new Schema<TSells, SellsModel>(
  {
    sellId: {
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
sellsSchema.statics.isShoeExists = async function (id: string) {
  return await Shoes.findOne({ _id: id });
};

export const Sells = model<TSells, SellsModel>('Sells', sellsSchema);
