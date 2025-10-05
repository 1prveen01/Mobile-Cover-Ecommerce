import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ProductModel from "@/models/products.model";
import mongoose from "mongoose";

//utility function to check the objectid is valid or not
const isValidObjectId = (id: string) => mongoose.Types.ObjectId.isValid(id);



//function for getting a product details by id (public)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } } // here we are doing Function parameter destructuring with type annotation
) {
  try {
    await dbConnect();

    //validates params.id
    if (!isValidObjectId(params.id)) {
      return NextResponse.json(
        { success: false, message: "Invalid product ID" },
        { status: 400 }
      );
    }

    const product = await ProductModel.findOne({_id: params.id , isDeleted: false}).populate(
      "productCategory"
    );

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Product fetched Successfully" ,data: product },{status: 200});
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong in getting product detail",
      },
      { status: 500 }
    );
  }
}
