import { Schema, model } from 'mongoose';
import { TShoes } from './interface.shoes';

const shoesSchema = new Schema<TShoes>({
  // id:{
  //   type:String
  // },
  productName: {
    type: String,
    // unique: true,
    required: true,
  },

  quantity: {
    type: Number,
    required: true,
  },
  price: { type: Number, required: true },
 
  productDescription: { type: String },
  coverPhoto : { type: String  },
})

export const Shoes = model<TShoes>('Shoes', shoesSchema);
