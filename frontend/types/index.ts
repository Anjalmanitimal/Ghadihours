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
  location: string;
  rating: number;
  useCase: "Fitness" | "Daily Use" | "Gift";
  text: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
  createdAt: string;
}

export interface IConfiguration {
  caseColor: string;
  strapColor: string;
  size: string;
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
  configuration: IConfiguration;
  quantity: number;
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
  isGuest: boolean;
  token: string;
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
  configuration: IConfiguration;
  quantity: number;
  deliveryDetails: IDeliveryDetails;
  paymentMethod: "card" | "esewa" | "khalti";
  isGuestOrder: boolean;
  guestEmail?: string;
}