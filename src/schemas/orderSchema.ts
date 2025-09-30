import { z } from "zod";

// Order item schema
const orderItemSchema = z.object({
  product: z.string().length(24, "Invalid Product Id"),
  quantity: z.number().int().min(1, "Quantity must be >= 1"),
  priceAtPurchase: z.number().positive("Price must be > 0"),
});

// Delivery address schema
const deliveryAddress = z.object({
  street: z.string().min(3).max(50),
  state: z.string().min(3).max(25),
  city: z.string().min(3).max(20),
  postalCode: z.string().length(6, "Postal code must consist of 6 digit"),
});

// Delivery details schema
const deliveryDetailsSchema = z.object({
  name: z.string().min(3, "Recipient name is required").max(40),
  mobile: z.string().length(24, "Mobile number must be 10 digits"),
  address: deliveryAddress,
});

// Order status enums
const statusSchema = z.enum([
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
]);

const paymentStatusSchema = z.enum(["pending", "paid", "failed", "refunded"]);

const razorpayDetailsSchema = z.object({
   paymentId: z.string().min(6, "Invalid payment Id"),
    orderId: z.string().min(6, "Invalid order Id"),
    signature: z.string().min(6, "Invalid signature"),
    method: z.enum(["card", "upi", "netbanking", "wallet"]),
}).optional();

const paymentMethodSchema = z.enum(["razorpay"]).default("razorpay");


// Final order schema
export const orderSchema = z.object({
  user: z.string().length(24, "Invalid user Id"),
  totalAmount: z.number(),
  items: z
    .array(orderItemSchema)
    .nonempty("At least one item is required")
    .refine((items) => items.every((i) => i.quantity >= 1), {
      message: "Quantity must be >= 1",
    }),
  deliveryDetails: deliveryDetailsSchema,
  status: statusSchema,
  paymentMethod: paymentMethodSchema,
  paymentStatus: paymentStatusSchema,
  razorpayDetails: razorpayDetailsSchema,
});
