import { Schema, model } from 'mongoose';
import { TShoes } from './interface.shoes';

const shoesSchema = new Schema<TShoes>(
  {
    productName: {
      type: String,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
    },
    price: { type: Number, required: true },

    brand: { type: String, required: true },
    model: { type: String, required: true },
    size: { type: String, required: true },
    gender: { type: String, required: true },
    category: { type: String, required: true },
    color: { type: String, required: true },
    rawMaterial: { type: String, required: true },

    coverPhoto: { type: String },
  },
  {
    timestamps: true, // gives create update time
  },
);

export const Shoes = model<TShoes>('Shoes', shoesSchema);
