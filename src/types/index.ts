export interface FoodItem {
  _id: string; // ID là bắt buộc
  name: string;
  price?: number;
  quantity?: number;
  description?: string;
  image?: string;
}

// Định nghĩa cấu trúc cho một món ăn trong đơn hàng
export interface OrderItem {
  food_id: {
    _id: string;
    name: string;
  };
  quantity: number;
  price: number;
}

// Định nghĩa cấu trúc cho toàn bộ đơn hàng
export interface Order {
  _id: string;
  items: OrderItem[];
  total_price: number;
}

export interface FoodType {
  _id: string;
  name: string;
  description: string;
}

export interface User {
  _id: string;
  name: string;
  phone: string;
  address: string;
  email: string;
  role: 'user' | 'admin';
}