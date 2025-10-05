import dbConnect from "@/lib/dbConnect";
import ProductModel from "@/models/products.model";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { productSchema } from "@/schemas/productSchema";
import { checkAdminAuth } from "@/lib/checkAdminAuth";

// Create a new product(Admin only)
export async function POST(request: NextRequest) {
  await dbConnect();

  const body = await request.json();

  try {
    //verify admin
    const { errorResponse } = await checkAdminAuth(request);
    if (errorResponse) {
      return errorResponse;
    }

    // Validate request body
    const validatedData = productSchema.parse(body);

    // Calculate final price
    const finalPrice = validatedData.discount
      ? validatedData.price -
        (validatedData.price * validatedData.discount) / 100
      : validatedData.price;

    const newProduct = new ProductModel({ ...validatedData, finalPrice });
    await newProduct.save();

    return NextResponse.json(
      {
        success: true,
        message: "Product created successfully",
        data: newProduct,
      },
      { status: 201 }
    );
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed while creating the product",
          errors: err.issues,
        },
        { status: 400 }
      );
    }

    console.error("Error creating Product", err);
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while creating the product",
      },
      { status: 500 }
    );
  }
}
