import mongoose, { Document, Schema } from "mongoose";

export interface IReview extends Document {
  product: mongoose.Types.ObjectId;
  reviewerName: string;
  location?: string;
  rating: number;
  useCase: "Fitness" | "Daily Use" | "Gift";
  text: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
}

const reviewSchema = new Schema<IReview>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    reviewerName: { type: String, required: true },
    location: { type: String },
    rating: { type: Number, required: true, min: 1, max: 5 },
    useCase: {
      type: String,
      enum: ["Fitness", "Daily Use", "Gift"],
      default: "Daily Use",
    },
    text: { type: String, required: true },
    verifiedPurchase: { type: Boolean, default: true },
    helpfulCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IReview>("Review", reviewSchema);