import {z} from "zod"
import ProductModel from "@/models/products.model"


export const productSchema = z.object({
  productName: z.string().min(1, "Product name is required"),
  productDescription: z.string().min(1, "Product description is required"),
  productCategory: z.string().length(24, "Invalid category ID"), // assuming MongoDB ObjectId
  productImage: z.array(z.string().url("Invalid image URL")).min(1, "At least one product image is required"),
  price: z.number().positive("Price must be greater than 0"),
  discount: z.number().min(0, "Discount cannot be negative").max(100, "Discount cannot exceed 100").optional(),
  colors: z.array(z.string()).optional(),
  compatibleModels: z.array(z.string()).optional(),
});
