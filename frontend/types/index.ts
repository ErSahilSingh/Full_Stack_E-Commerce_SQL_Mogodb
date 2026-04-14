export type ApiSuccess<T> = { data: T; message: string };
export type ApiError = { error: string };

export type Product = {
  _id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  stock: number;
  images: string[];
  createdAt?: string;
};

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

export type Cart = {
  userId?: number;
  items: CartItem[];
  updatedAt?: string | null;
};

export type OrderItem = {
  id: number;
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
};

export type Order = {
  id: number;
  user_id: number;
  total_amount: number;
  status: string;
  created_at: string;
  items: OrderItem[];
};

export type DailyRevenueRow = { day: string | Date; revenue: string | number };
export type TopSpenderRow = {
  id: number;
  name: string;
  email: string;
  total_spent: string | number;
};
export type CategorySalesRow = {
  _id: string;
  totalQuantity: number;
  totalRevenue: number;
};
