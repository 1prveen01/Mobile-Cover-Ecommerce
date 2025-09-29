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


//Pre-save hook to always recalc totalPrice
CartSchema.pre("save", async function (next) {
  const cart = this as CartInterface; //here this refers to the cart document

  await cart.populate("items.product");

  let total = 0;
  for (const item of cart.items) {
    const product = item.product as ProductInterface; //it checks the types of the items.product
    const price = product.finalPrice ?? product.price;
    total += price * item.quantity;
  }

  cart.totalPrice = total;
  next();
});

const CartModel = (mongoose.models.Cart as mongoose.Model<CartInterface>) || mongoose.model("Cart", CartSchema)
export default CartModel