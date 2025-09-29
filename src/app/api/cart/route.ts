import dbConnect from "@/lib/dbConnect";
import ProductModel from "@/models/products.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import CartModel from "@/models/cart.model";



//add to cart function
export async function POST(
  request: NextRequest,
) {
  try {
    await dbConnect();

    const body = await request.json();

    const { userId, productId, quantity } = body;

    //validating userId and productId
    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(productId)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid UserId or ProductId",
        },
        { status: 400 }
      );
    }

    //Validate quantity
    if (!quantity || quantity < 1) {
      return NextResponse.json(
        { success: false, message: "Quantity must be at least 1" },
        { status: 400 }
      );
    }


    //finding product with productId if exist
    const product = await ProductModel.findById(productId);
    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found",
        },
        { status: 404 }
      );
    }

    //finding cart related to user if exist using userId
    let cart = await CartModel.findOne({ user: userId });
    if (!cart) {
      //create a new cart
      cart = new CartModel({
        user: userId,
        items: [{ product: productId, quantity }],
      });
    } else {
      //check for existing cart
      const item = cart.items.find(
        (item) => item.product.toString() === productId
      );

      if (item) {
        item.quantity += quantity; // increment quantity
      } else {
        cart.items.push({ product: productId, quantity });
      }
    }

    await cart.save()
    await cart.populate("items.product"); // to return product details in response

    return NextResponse.json({
        success: true,
        message: "Added to cart Successfully",
        data: cart
    }, {status: 200})
  } catch (error) {
    console.error("Error while adding product to cart ", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error while adding product to cart",
      },
      {
        status: 500,
      }
    );
  }
}


