import dbConnect from "@/lib/dbConnect";
import CartModel from "@/models/cart.model";
import mongoose from "mongoose";
import { NextRequest , NextResponse } from "next/server";


//function for getting cart 
export async function GET(request: NextRequest , {params}:{params:{userId:string}}) {
  try {

    await dbConnect()

    const { userId } = params;

    //validating userId
    if(!mongoose.Types.ObjectId.isValid(userId)){
        return NextResponse.json({
            success:false,
            message: "Invalid userId"
        }, {status: 400})
    }

    const cart = await CartModel.findOne({user: userId}).populate("items.product")
    if(!cart){
      return NextResponse.json({
        success: false,
        message: "cart not found"
      }, {status: 404})
    }

    return NextResponse.json({
      success: true,
      message: "cart fetched Successfully",
      data: cart,
    }, {status: 200})

  } catch (error) {
    console.error("Error in getting the cart items ", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error in getting the cart items",
      },
      { status: 500 }
    );
  }
}
