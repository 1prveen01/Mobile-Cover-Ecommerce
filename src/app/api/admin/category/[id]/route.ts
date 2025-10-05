import { checkAdminAuth } from "@/lib/checkAdminAuth";
import dbConnect from "@/lib/dbConnect";
import CategoryModel from "@/models/category.model";
import { categorySchema } from "@/schemas/categorySchema";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

//validating the parameter id
const isValidObjectId = (id: string) => {
  return mongoose.Types.ObjectId.isValid(id);
};

//function for updating a category (Admin Only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {

    //verify admin
    const { errorResponse } = await checkAdminAuth(request);
    if (errorResponse) {
      return errorResponse;
    }

    await dbConnect();

    if (!isValidObjectId(params.id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid object Id",
        },
        { status: 400 }
      );
    }

    //requesting data from body and validating through zod
    const body = await request.json();
    const validatedData = categorySchema.parse(body);

    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      params.id,
      { $set: { ...validatedData } },
      { new: true }
    );

    if (!updatedCategory) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        success: true,
        message: "Category updated Successfully",
        data: updatedCategory,
      },
      { status: 200 }
    );
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation error in updating category ",
        },
        { status: 400 }
      );
    }

    //duplicate category check
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: "Category name already exists" },
        { status: 409 }
      );
    }
    console.error("Error in updating Category ", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error in updating category",
      },
      { status: 500 }
    );
  }
}

//function for deleting category(Admin Only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {

    //verify admin
    const { errorResponse } = await checkAdminAuth(request);
    if (errorResponse) {
      return errorResponse;
    }


    await dbConnect();


    

    if (!isValidObjectId(params.id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Object Id",
        },
        { status: 400 }
      );
    }

    const deletedProduct = await CategoryModel.findByIdAndUpdate(
      params.id,
      { $set: { isDeleted: true } },
      { new: true }
    );
    if (!deletedProduct) {
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
        message: "Category Deleted Successfully",
        data: deletedProduct,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while Deleting Category ", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error while deleting Category",
      },
      { status: 500 }
    );
  }
}
