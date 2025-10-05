import dbConnect from "@/lib/dbConnect";
import CategoryModel from "@/models/category.model";
import { categorySchema } from "@/schemas/categorySchema";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

//validating the parameter id
const isValidObjectId = (id: string) => {
  return mongoose.Types.ObjectId.isValid(id);
};

//function for getting a category with id
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    if (!isValidObjectId(params.id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Category id",
        },
        { status: 400 }
      );
    }

    const category = await CategoryModel.findById(params.id);
    if (!category) {
      return NextResponse.json(
        {
          success: false,
          message: "Category not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Category fetched Successfully",
        data: category,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while fetching category using id ", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error while fetching category using id ",
      },
      { status: 500 }
    );
  }
}

