import mongoose, { Document, Schema } from "mongoose";
import { UserInterface } from "./users.model";
import { OrderInterface } from "./order.model";

export interface PaymentInterface extends Document {
  user: mongoose.Types.ObjectId | UserInterface;
  order: mongoose.Types.ObjectId | OrderInterface;
  amount: number;
  razorpayOrderId: string;
  razorpayPaymentId?: string; // filled after successful payment
  razorpaySignature?: string; // for signature verification
  method?: "card" | "upi" | "netbanking" | "wallet"; // filled after payment
  status: "created" | "authorized" | "captured" | "failed" | "refunded";
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema: Schema<PaymentInterface> = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    razorpayOrderId: {
      type: String,
      required: true,
    },
    razorpayPaymentId: {
      type: String,
      required: function () {
        return this.status === "captured";
      },
    },
    razorpaySignature: {
      type: String,
      required: function () {
        return this.status === "captured";
      },
    },
    method: {
      type: String,
      enum: ["card", "upi", "netbanking", "wallet"],
      required: function () {
        return this.status === "captured";
      },
    },
    status: {
      type: String,
      enum: ["created", "authorized", "captured", "failed", "refunded"],
      default: "created",
    },
  },
  {
    timestamps: true,
  }
);

const PaymentModel =
  (mongoose.models.Payment as mongoose.Model<PaymentInterface>) ||
  mongoose.model<PaymentInterface>("Payment", paymentSchema);

export default PaymentModel;
