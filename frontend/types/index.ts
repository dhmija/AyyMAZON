export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface ProductImage {
  id: string;
  imageUrl: string;
}

export interface Product {
  id: string;
  title: string;
  description: string | null;
  price: string;
  originalPrice?: string | null;
  discountPercentage?: string | null;
  rating?: string | null;
  reviewCount?: number | null;
  stock: number;
  categoryId: string;
  category?: Category;
  images?: ProductImage[];
  createdAt?: string;
}

export interface CartItemProduct {
  id: string;
  title: string;
  description?: string | null;
  price: string;
  stock: number;
  category: Category;
  image: string | null;
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: CartItemProduct;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: string;
  product: { id: string; title: string; image: string | null };
}

export interface Order {
  id: string;
  userId: string;
  totalAmount: string;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

export interface AddressFormData {
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
}
