
import {z} from "zod"

// MongoDB ObjectId validation (24 chars)
const objectId = z.string().length(24, "Invalid MongoDB ObjectId");


// Enum for allowed payment methods
const paymentMethodSchema = z.enum(["card", "upi", "netbanking", "wallet"]);

// Enum for payment status stages
const paymentStatusSchema = z.enum([
  "created",
  "authorized",
  "captured",
  "failed",
  "refunded",
]);


//used to create order payment
export const createPaymentSchema = z.object({
  user: objectId,
  order: objectId,
  amount: z.number().positive("Amount must be greater than 0"),
});

//verify razorpay payment schema
export const verifyPaymentSchema = z.object({
  razorpay_order_id: z.string().min(6, "Invalid Razorpay order ID"),
  razorpay_payment_id: z.string().min(6, "Invalid Razorpay payment ID"),
  razorpay_signature: z.string().min(6, "Invalid Razorpay signature"),
});

export const paymentSchema = z.object({

    user: objectId,
    order : objectId,
    amount: z.number().positive(),
    razorpayOrderId : z.string().min(6),
    razorpayPaymentId: z.string().optional(),
  razorpaySignature: z.string().optional(),
  method: paymentMethodSchema.optional(),
  status: paymentStatusSchema.default("created"),
})

