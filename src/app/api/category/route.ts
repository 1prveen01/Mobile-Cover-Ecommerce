import dbConnect from "@/lib/dbConnect";
import CategoryModel from "@/models/category.model";
import { NextRequest, NextResponse } from "next/server";


//get all the category
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    //find all the documents of categories
    const categories = await CategoryModel.find().sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        message: "Categories fetched Successfully",
        data: categories,
        categoriesCount: categories.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while getting the category ", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error while getting the category",
      },
      { status: 500 }
    );
  }
}
