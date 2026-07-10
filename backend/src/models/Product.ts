import mongoose, { Document, Schema } from "mongoose";

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

export interface IProduct extends Document {
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

const variantSchema = new Schema<IVariant>({
  caseColor: { type: String, required: true },
  strapColor: { type: String, required: true },
  size: { type: String, required: true },
  stock: { type: Number, default: 50 },
});

const featureSchema = new Schema<IFeature>({
  title: { type: String, required: true },
  body: { type: String, required: true },
  benefitTag: { type: String, required: true },
  icon: { type: String, required: true },
});

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, default: "Kada Smart Watch" },
    tagline: { type: String, default: "Built for the life you live." },
    description: { type: String, required: true },
    price: { type: Number, required: true, default: 32000 },
    images: [{ type: String }],
    features: [featureSchema],
    variants: [variantSchema],
    waterResistance: { type: String, default: "5ATM" },
    batteryLife: { type: String, default: "Up to 7 days" },
    warrantyMonths: { type: Number, default: 12 },
    returnWindowDays: { type: Number, default: 30 },
    freeShipping: { type: Boolean, default: true },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IProduct>("Product", productSchema);