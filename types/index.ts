// Product Types
export interface Product {
  _id?: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number; // Original price (for showing discounts)
  images: string[];
  category: string;
  supplierUrl?: string; // URL to supplier's product page
  supplierName?: string;
  supplierPrice?: number; // Your cost from supplier
  stock: number;
  sku: string;
  tags: string[];
  featured: boolean;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// User Types
export interface User {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role: 'customer' | 'admin';
  addresses?: Address[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  _id?: string;
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

// Order Types
export interface Order {
  _id?: string;
  orderNumber: string;
  userId: string;
  customerEmail: string;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress: Address;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentIntentId?: string;
  supplierOrders?: SupplierOrder[]; // Orders placed with suppliers
  trackingNumbers?: TrackingInfo[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  sku: string;
  supplierUrl?: string;
  supplierName?: string;
}

export interface SupplierOrder {
  supplierId: string;
  supplierName: string;
  orderNumber: string;
  items: OrderItem[];
  cost: number;
  status: 'pending' | 'ordered' | 'shipped' | 'delivered';
  trackingNumber?: string;
  placedAt?: Date;
}

export interface TrackingInfo {
  carrier: string;
  trackingNumber: string;
  url?: string;
}

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export type PaymentStatus =
  | 'pending'
  | 'paid'
  | 'failed'
  | 'refunded';

// Cart Types
export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  sku: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Filter and Pagination Types
export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  tags?: string[];
  search?: string;
  featured?: boolean;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
