import mongoose, { Document, Schema } from "mongoose";

export interface UserInterface extends Document {
  fullName: string;
  email: string;
  role: "customer" | "admin";
  mobileNumber: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema: Schema<UserInterface> = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid Email"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },

    verifyCode: {
      type: String,
    },
    verifyCodeExpiry: {
      type: Date,
    },
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
    mobileNumber: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
   
  },
  {
    timestamps: true,
  }
);


const UserModel = ( mongoose.models.User as mongoose.Model<UserInterface> )|| mongoose.model<UserInterface>("User", userSchema)

export default UserModel;
