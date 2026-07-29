import mongoose, { Document, Schema } from "mongoose";

export interface IReview extends Document {
  product: mongoose.Types.ObjectId;
  user?: mongoose.Types.ObjectId;
  reviewerName: string;
  location?: string;
  rating: number;
  useCase: "Fitness" | "Daily Use" | "Gift";
  text: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
  status: "pending" | "approved" | "hidden";
}

const reviewSchema = new Schema<IReview>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
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
    status: {
      type: String,
      enum: ["pending", "approved", "hidden"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IReview>("Review", reviewSchema);
