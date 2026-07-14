import mongoose, { Document, Schema } from "mongoose";

export interface ICartItem {
  _id: mongoose.Types.ObjectId;
  caseColor: string;
  strapColor: string;
  size: string;
  quantity: number;
  price: number;
}

export interface ICart extends Document {
  user: mongoose.Types.ObjectId;
  items: ICartItem[];
}

const cartItemSchema = new Schema<ICartItem>({
  caseColor: { type: String, required: true },
  strapColor: { type: String, required: true },
  size: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1, min: 1 },
  price: { type: Number, required: true },
});

const cartSchema = new Schema<ICart>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    items: [cartItemSchema],
  },
  { timestamps: true }
);

export default mongoose.model<ICart>("Cart", cartSchema);
