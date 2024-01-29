import { Schema, model } from 'mongoose';
import { TShoes } from './interface.course';

const shoesSchema = new Schema<TShoes>({
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

  uploadDate: { type: String, required: true },
  productDescription: { type: String },
});

export const Course = model<TShoes>('Shoes', shoesSchema);
