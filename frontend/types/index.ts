export interface IVariant {
  caseColor: string;
  strapColor: string;
  size: string;
  stock: number;
}

export interface IFeature {
  title: string;
  body: string;
  benefitTag: string;
  icon: string;
}

export interface IProduct {
  _id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  images: string[];
  features: IFeature[];
  variants: IVariant[];
  waterResistance: string;
  batteryLife: string;
  warrantyMonths: number;
  returnWindowDays: number;
  freeShipping: boolean;
  rating: number;
  reviewCount: number;
}

export interface IReview {
  _id: string;
  reviewerName: string;
  location?: string;
  rating: number;
  useCase: "Fitness" | "Daily Use" | "Gift";
  text: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
  status: "pending" | "approved" | "hidden";
  createdAt: string;
}

export interface IConfiguration {
  caseColor: string;
  strapColor: string;
  size: string;
}

export interface IOrderItem {
  caseColor: string;
  strapColor: string;
  size: string;
  quantity: number;
  price: number;
}

export interface IDeliveryDetails {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  country: string;
}

export interface IPricing {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

export interface IOrder {
  _id: string;
  orderNumber: string;
  items: IOrderItem[];
  isGuestOrder: boolean;
  guestEmail?: string;
  deliveryDetails: IDeliveryDetails;
  pricing: IPricing;
  paymentMethod: "card" | "esewa" | "khalti";
  paymentStatus: "pending" | "paid" | "failed";
  orderStatus: "Order Placed" | "Processing" | "Shipped" | "Delivered";
  estimatedDeliveryDate: string;
  createdAt: string;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  isGuest: boolean;
  isAdmin: boolean;
  token: string;
}

export interface IAdminStats {
  totalOrders: number;
  pending: number;
  shipped: number;
  delivered: number;
  revenue: number;
}

export interface ICustomer {
  _id: string;
  name: string;
  email: string;
  phone: string | null;
  isGuest: boolean;
  createdAt: string;
  orderCount: number;
  totalSpent: number;
  lastOrderStatus: string | null;
  lastOrderNumber: string | null;
}

export interface IAuthResponse {
  success: boolean;
  data: IUser;
}

export interface ICartItem {
  _id: string;
  caseColor: string;
  strapColor: string;
  size: string;
  quantity: number;
  price: number;
}

export interface ICart {
  _id: string;
  user: string;
  items: ICartItem[];
}

export interface ICreateOrderPayload {
  items: { caseColor: string; strapColor: string; size: string; quantity: number }[];
  deliveryDetails: IDeliveryDetails;
  paymentMethod: "card" | "esewa" | "khalti";
  isGuestOrder: boolean;
  guestEmail?: string;
}