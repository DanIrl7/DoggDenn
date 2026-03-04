export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  images?: string[];
  categoryId: string | null;
  inventory?: number;
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
}

export interface CartItem extends Product {
  quantity: number;
}


export interface CheckoutSessionRequest {
  items: CartItem[];
  total: number;
}
