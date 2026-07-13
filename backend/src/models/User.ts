import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface ISavedConfig {
  caseColor: string;
  strapColor: string;
  size: string;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone?: string;
  isGuest: boolean;
  savedConfiguration?: ISavedConfig;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    phone: { type: String },
    isGuest: { type: Boolean, default: false },
    savedConfiguration: {
      caseColor: String,
      strapColor: String,
      size: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model<IUser>("User", userSchema);