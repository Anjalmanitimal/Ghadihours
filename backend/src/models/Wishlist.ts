import mongoose, { Document, Schema } from "mongoose";

export interface IWishlistItem {
  _id: mongoose.Types.ObjectId;
  caseColor: string;
  strapColor: string;
  size: string;
  price: number;
}

export interface IWishlist extends Document {
  user: mongoose.Types.ObjectId;
  items: IWishlistItem[];
}

const wishlistItemSchema = new Schema<IWishlistItem>(
  {
    caseColor: { type: String, required: true },
    strapColor: { type: String, required: true },
    size: { type: String, required: true },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

const wishlistSchema = new Schema<IWishlist>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    items: [wishlistItemSchema],
  },
  { timestamps: true }
);

export default mongoose.model<IWishlist>("Wishlist", wishlistSchema);
