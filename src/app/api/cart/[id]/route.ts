import dbConnect from "@/lib/dbConnect";
import CartModel from "@/models/cart.model";
import mongoose from "mongoose";
import { NextRequest , NextResponse } from "next/server";

export async function GET(request: NextRequest , {params}:{params:{id:string}}) {
  try {

    await dbConnect()

    const {id: userId} = params;

    //validating userId
    if(!mongoose.Types.ObjectId.isValid(userId)){
        return NextResponse.json({
            success:false,
            message: "Invalid userId"
        }, {status: 400})
    }

    const cartItems = await CartModel.findOne({user: userId}).populate("items.product")
    if(!cartItems){
      return NextResponse.json({
        success: false,
        message: "CartItem not found"
      }, {status: 404})
    }

    return NextResponse.json({
      success: true,
      message: "CartItem fetched Successfully",
      data: cartItems,
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
