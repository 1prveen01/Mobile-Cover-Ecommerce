import dbConnect from "@/lib/dbConnect";
import CategoryModel from "@/models/category.model";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { checkAdminAuth } from "@/lib/checkAdminAuth";

const isValidObjectId = (id: string) => mongoose.Types.ObjectId.isValid(id);

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin first
    const { errorResponse } = await checkAdminAuth(request);
    if (errorResponse) return errorResponse;

    await dbConnect();

    // Validate ID
    if (!isValidObjectId(params.id)) {
      return NextResponse.json(
        { success: false, message: "Invalid category ID" },
        { status: 400 }
      );
    }

    // Restore deleted category
    const category = await CategoryModel.findById(params.id);
    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    if (!category.isDeleted) {
      return NextResponse.json(
        { success: false, message: "Category is already active" },
        { status: 400 }
      );
    }

    category.isDeleted = false;
    await category.save();

    return NextResponse.json(
      {
        success: true,
        message: "Category restored successfully",
        data: category,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while restoring category:", error);
    return NextResponse.json(
      { success: false, message: "Error while restoring category" },
      { status: 500 }
    );
  }
}
