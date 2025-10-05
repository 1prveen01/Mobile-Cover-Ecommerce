import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ProductModel from "@/models/products.model";
import { productSchema } from "@/schemas/productSchema";
import { z } from "zod";
import mongoose from "mongoose";
import { checkAdminAuth } from "@/lib/checkAdminAuth";

//utility function to check the objectid is valid or not
const isValidObjectId = (id: string) => mongoose.Types.ObjectId.isValid(id);

//function for updating a product(Admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    //verify admin
    await dbConnect();

    //validating params.id
    if (!isValidObjectId(params.id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid product ID",
        },
        { status: 400 }
      );
    }

    //requesting body fields
    const body = await request.json();

    //creating a zod validation for updating products
    const updatedProductSchema = productSchema.partial(); // all required fields are not optional using partial

    //Validate request body
    const validatedData = updatedProductSchema.parse(body);

    //finding product through id in params
    const existingProduct = await ProductModel.findById(params.id).populate(
      "productCategory"
    );

    if (!existingProduct) {
      return NextResponse.json(
        {
          success: false,
          message: "Error in finding product",
        },
        { status: 404 }
      );
    }

    let finalPrice = existingProduct.finalPrice;

    //calculating final price if there is a change in price and discount
    if (
      validatedData.price !== undefined ||
      validatedData.discount !== undefined
    ) {
      const newPrice = validatedData.price ?? existingProduct.price;
      const newDiscount =
        validatedData.discount ?? existingProduct.discount ?? 0;

      finalPrice =
        newDiscount > 0 ? newPrice - (newPrice * newDiscount) / 100 : newPrice;
    }

    //updating fields like name , description , etc
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      params.id,
      {
        $set: {
          ...validatedData,
          ...(finalPrice !== undefined && { finalPrice }),
        },
      },
      { new: true }
    ).populate("productCategory");

    return NextResponse.json(
      {
        success: true,
        message: "Product Updated Successfully",
        data: updatedProduct,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed while updating the product",
          errors: error.issues,
        },
        { status: 400 }
      );
    }
    console.error("Error in updating a product ", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error in updating a product",
      },
      { status: 500 }
    );
  }
}

//function for deleting a product(Admin only)
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

    //validating object id
    if (!isValidObjectId(params.id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid product Id",
        },
        { status: 400 }
      );
    }

    const product = await ProductModel.findByIdAndUpdate(
      params.id,
      { $set: { isDeleted: true } },
      { new: true }
    );
    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found with this id",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Product Deleted Successfully",
        data: product,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Something went wrong while deleting the product");
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while deleting the product",
      },
      {
        status: 500,
      }
    );
  }
}
