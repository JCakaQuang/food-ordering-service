export interface FoodItem {
  _id: string; // ID là bắt buộc
  name: string;
  price?: number;
  quantity?: number;
  description?: string;
  image?: string;
}