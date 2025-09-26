import mongoose, { Schema, Document } from "mongoose";
import { ProductInterface } from "./products.model";
import { UserInterface } from "./users.model";

export interface WishlistInterface extends Document {
  products: (Schema.Types.ObjectId | ProductInterface)[];
  user: Schema.Types.ObjectId | UserInterface;
  createdAt: Date;
  updatedAt: Date;
}

const wishlistSchema: Schema<WishlistInterface> = new Schema(
  {
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,    
    },
  },
  {
    timestamps: true,
  }
);

const WishlistModel = (mongoose.models.Wishlist as mongoose.Model<WishlistInterface>) || mongoose.model<WishlistInterface>("Wishlist", wishlistSchema)

export default WishlistModel;