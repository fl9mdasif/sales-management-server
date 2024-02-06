export type TShoes = {
  // id?:string;
  productName: string;
  price: number;
  quantity: number;
  productDescription?: string;

  brand: string;
  model: string;
  size: string;
  category: string;
  gender: 'male' | 'female';
  color: string;
  rawMaterial: 'leather' | 'fabric' | 'jeans';

  coverPhoto: string | undefined;
};
