import mongoose, { Document, Schema } from "mongoose";

export interface CategoryInterface extends Document {
  categoryName: string;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema:Schema<CategoryInterface> = new Schema(
  {
    categoryName: {
      type: String,
      required: true,
      unique : true,
      trim: true
    },
  },
  {
    timestamps: true,
  }
);

const CategoryModel = (mongoose.models.Category as mongoose.Model<CategoryInterface>) || mongoose.model<CategoryInterface>("Category",categorySchema)

export default CategoryModel