import mongoose, { Document, Schema } from "mongoose";

export interface IDeliveryDetails {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  country: string;
}

export interface IOrderItem {
  caseColor: string;
  strapColor: string;
  size: string;
  quantity: number;
  price: number;
}

export interface IPricing {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

export interface IOrder extends Document {
  orderNumber: string;
  user?: mongoose.Types.ObjectId;
  guestEmail?: string;
  isGuestOrder: boolean;
  items: IOrderItem[];
  deliveryDetails: IDeliveryDetails;
  pricing: IPricing;
  paymentMethod: "card" | "esewa" | "khalti";
  paymentStatus: "pending" | "paid" | "failed";
  orderStatus: "Order Placed" | "Processing" | "Shipped" | "Delivered";
  estimatedDeliveryDate: Date;
}

const orderItemSchema = new Schema<IOrderItem>(
  {
    caseColor: { type: String, required: true },
    strapColor: { type: String, required: true },
    size: { type: String, required: true },
    quantity: { type: Number, required: true, default: 1 },
    price: { type: Number, required: true },
  },
  { _id: false }
);

const orderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    guestEmail: { type: String },
    isGuestOrder: { type: Boolean, default: false },

    items: { type: [orderItemSchema], required: true },

    deliveryDetails: {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      country: { type: String, required: true },
    },

    pricing: {
      subtotal: { type: Number, required: true },
      shipping: { type: Number, default: 0 },
      tax: { type: Number, default: 0 },
      total: { type: Number, required: true },
    },

    paymentMethod: {
      type: String,
      enum: ["card", "esewa", "khalti"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: ["Order Placed", "Processing", "Shipped", "Delivered"],
      default: "Order Placed",
    },
    estimatedDeliveryDate: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IOrder>("Order", orderSchema);
