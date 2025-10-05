import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ProductModel from "@/models/products.model";
import mongoose from "mongoose";
import { checkAdminAuth } from "@/lib/checkAdminAuth";

const isValidObjectId = (id: string) => mongoose.Types.ObjectId.isValid(id);

//patch restore for restoring products(Admin Only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    //verify admib
    const { errorResponse } = await checkAdminAuth(request);
    if (errorResponse) {
      return errorResponse;
    }

    await dbConnect();

    if (!isValidObjectId(params.id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid product id",
        },
        { status: 400 }
      );
    }

    //restore only if its deleted
    const product = await ProductModel.findByIdAndUpdate(
      { _id: params.id, isDeleted: true },
      { $set: { isDeleted: false } },
      { new: true }
    );
    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found while restoring",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Product Restored Successfully",
        data: product,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Something went wrong while restoring deleted product ",
      error
    );
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while restoring deleted product",
      },
      { status: 500 }
    );
  }
}
