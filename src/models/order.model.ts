import mongoose, { Schema, Document } from "mongoose";
import { UserInterface } from "./users.model";
import { ProductInterface } from "./products.model";

export interface OrderInterface extends Document {
  user: mongoose.Types.ObjectId | UserInterface;
  totalAmount: number;
  items: {
    product: mongoose.Types.ObjectId | ProductInterface;
    quantity: number;
    priceAtPurchase: number;
  }[];
  deliveryDetails: {
    name: string;      
    mobile: string;     
    address: {
      street: string;
      city: string;
      state: string;
      postalCode: string;
    };
  };
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  razorpayDetails?: {
    paymentId?: string;
    orderId?: string;
    signature?: string;
    method?: "card" | "upi" | "netbanking" | "wallet";
  };
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  paymentMethod: "razorpay"; // only online prepaid
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema: Schema<OrderInterface> = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        priceAtPurchase: {
          type: Number,
          required: true,
        },
      },
    ],
    deliveryDetails: {
      name: { type: String, required: true },
      mobile: { type: String, required: true },
      address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        postalCode: { type: String, required: true },
      },
    },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["razorpay"], 
      required: true,
      default: "razorpay",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    razorpayDetails: {
      paymentId: { type: String },
      orderId: { type: String },
      signature: { type: String },
      method: { type: String, enum: ["card", "upi", "netbanking", "wallet"] },
    },
  },
  { timestamps: true }
);

const OrderModel =
  (mongoose.models.Order as mongoose.Model<OrderInterface>) ||
  mongoose.model<OrderInterface>("Order", orderSchema);

export default OrderModel;
