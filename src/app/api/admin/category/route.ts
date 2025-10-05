import { checkAdminAuth } from "@/lib/checkAdminAuth";
import dbConnect from "@/lib/dbConnect";
import CategoryModel from "@/models/category.model";
import { categorySchema } from "@/schemas/categorySchema";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

//creating a category (Admin only)
export async function POST(request: NextRequest) {


    //verify admin
  const { errorResponse } = await checkAdminAuth(request);
  if (errorResponse) {
    return errorResponse;
  }

  await dbConnect();

  const body = await request.json();
  try {
    
    //validating body
    const validatedData = categorySchema.parse(body);

    const newCategory = new CategoryModel({ ...validatedData });
    await newCategory.save();

    return NextResponse.json(
      {
        success: true,
        message: "Category Created Successfully",
        data: newCategory,
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed while creating the category ",
          errors: error.issues,
        },
        { status: 400 }
      );
    }

    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: "Category already exists" },
        { status: 409 }
      );
    }

    console.error("Error while creating product category ", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error while creating product category",
      },
      { status: 500 }
    );
  }
}
