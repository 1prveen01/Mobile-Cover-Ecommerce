import dbConnect from "@/lib/dbConnect";
import CartModel from "@/models/cart.model";
import OrderModel from "@/models/order.model";
import { orderSchema } from "@/schemas/orderSchema";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    //requesting data from body
    const body = await request.json();

    //validating data with zod
    const parsed = orderSchema.partial({ items: true }).safeParse(body); //items are optional

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, errors: z.treeifyError(parsed.error) },
        { status: 400 }
      );
    }
    if (!parsed.data.deliveryDetails) {
      return NextResponse.json(
        { success: false, message: "Delivery details are required" },
        { status: 400 }
      );
    }

    //extracting fields from validated body
    const { user, items: directItems, deliveryDetails } = parsed.data;

    //validating userId
    if (!mongoose.Types.ObjectId.isValid(user)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid userId",
        },
        { status: 400 }
      );
    }

    let items = [];

    if (directItems && directItems.length > 0) {
      //Direct purchase (items sent in request)
      //If items were passed treat it as a direct purchase
      items = directItems;
    } else {
      //Checkout from Cart
      const cart = await CartModel.findOne({ user }).populate("items.product");

      if (!cart || cart.items.length === 0) {
        return NextResponse.json(
          { success: false, message: "Cart is empty" },
          { status: 400 }
        );
      }

      //if cart item present store it in items
      items = cart.items.map((item) => ({
        product: (item.product as any)._id,
        quantity: item.quantity,
        priceAtPurchase:
          (item.product as any).finalPrice ?? (item.product as any).price,
      }));

      //clear cart after placing order
      cart.items = [];
      cart.totalPrice = 0;
      await cart.save();
    }

    //calculating total Amount
    const totalAmount = items.reduce(
      (acc, item) => acc + item.priceAtPurchase * item.quantity,
      0
    );

    //creating order
    const order = new OrderModel({
      user,
      items,
      totalAmount,
      deliveryDetails,
      paymentMethod: "razorpay",
      paymentStatus: "pending",
      status: "pending",
    });

    
    await order.save();
    await order.populate("items.product");

    return NextResponse.json(
      {
        success: true,
        message: "Order placed successfully",
        data: order,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) { 
        return NextResponse.json({
            success: false,
            message: "Error in validating order"
        },{status: 400})
     }

    console.error("Error in placing order ", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error in placing order",
      },
      { status: 500 }
    );
  }
}
