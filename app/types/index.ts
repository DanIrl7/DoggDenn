export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  images?: string[];
  categoryId?: string;
  inventory?: number;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
}
