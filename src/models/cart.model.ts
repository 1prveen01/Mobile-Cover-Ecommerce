import mongoose, { Document, Schema } from "mongoose";
import { UserInterface } from "./users.model";
import { ProductInterface } from "./products.model";

export interface CartItemInterface {
  product: mongoose.Types.ObjectId | ProductInterface;
  quantity: number;
}
export interface CartInterface extends Document {
  user: mongoose.Types.ObjectId | UserInterface;
  items: CartItemInterface[];
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

const CartSchema: Schema<CartInterface> = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // each user has one cart
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
          default: 1,
        },
      },
    ],
    totalPrice: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);



const CartModel = (mongoose.models.Cart as mongoose.Model<CartInterface>) || mongoose.model("Cart", CartSchema)
export default CartModel