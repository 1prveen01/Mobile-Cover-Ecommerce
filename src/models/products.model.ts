import mongoose, { Schema, Document } from "mongoose";
import  { CategoryInterface } from "./category.model";

export interface ProductInterface extends Document {
  productName: string;
  productDescription: string;
  productImage: string[];
  price: number;
  finalPrice: number;
  productCategory: mongoose.Types.ObjectId | CategoryInterface;
  discount?: number;
  colors?: string;
  compatibleModels: string[];
  createdAt: Date;
  updatedAt: Date;
}

const productSchema: Schema<ProductInterface> = new Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    productDescription: {
      type: String,
      required: true,
    },
    productCategory: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    productImage: [
      {
        type: String,
        required: true,
      },
    ],
    discount: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
    },
    finalPrice: {
      type: Number,
    },
    colors: {
      type: String,
    },
    compatibleModels: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const ProductModel =
  (mongoose.models.Product as mongoose.Model<ProductInterface>) ||
  mongoose.model<ProductInterface>("Product", productSchema);

export default ProductModel;
