import dbConnect from "@/lib/dbConnect";
import OrderModel from "@/models/order.model";
import { orderSchema } from "@/schemas/orderSchema";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import {  z } from "zod";

//importing only statusSchema from orderSchema
const statusSchema = orderSchema.shape.status;

const bodySchema = z.object({
  status: statusSchema,
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    await dbConnect();

    const { orderId } = params;
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid orderId",
        },
        { status: 400 }
      );
    }

    //parse request body
    const body = await request.json();
    const parsed = bodySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          errors: z.treeifyError(parsed.error),
        },
        { status: 400 }
      );
    }

    const newStatus = parsed.data.status;

    //find and update the order
    const updatedOrder = await OrderModel.findByIdAndUpdate(
      orderId,
      { $set: { status: newStatus } },
      { new: true }
    ).populate("items.product", "productName price finalPrice");

    //handle missing order
    if (!updatedOrder) {
      return NextResponse.json(
        {
          success: false,
          message: "updated order not found ",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: `Order status updated to '${newStatus}' successfully`,
        data: updatedOrder,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed in posting order status ",
          errors: error.issues,
        },
        { status: 400 }
      );
    }

    console.error("Error in posting order status ", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error in posting order status",
      },
      { status: 500 }
    );
  }
}
