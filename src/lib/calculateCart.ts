import mongoose from "mongoose";
import { CartInterface } from "../models/cart.model";
import { ProductInterface } from "../models/products.model";

export async function calculateCartTotal(cart: CartInterface): Promise<number> {
  const ProductModel = mongoose.model<ProductInterface>("Product");

  const productIds = cart.items.map(item => item.product);

  
  //getting the array of products objects
  const products = await ProductModel.find({ _id: { $in: productIds } }).lean();

  
  //converting products array to key value pair for faster searching
  const productMap = new Map(
    products.map(product => [product._id.toString(), product])
  );

  //Calculating total price
  let total = 0;
  for (const item of cart.items) {
    const product = productMap.get(item.product.toString());
    if (product) {
      const price = product.finalPrice ?? product.price; 
        total += price * item.quantity;
    }
  }

  return total;
}
