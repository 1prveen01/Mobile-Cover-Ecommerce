import { checkAdminAuth } from "@/lib/checkAdminAuth";
import dbConnect from "@/lib/dbConnect";
import OrderModel from "@/models/order.model";
import { orderSchema } from "@/schemas/orderSchema";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

//importing schema from orderSchema
const statusSchema = orderSchema.shape.status;

//validating body
const bodySchema = z.object({
  status: statusSchema,
});

//function for updating order status(Admin Only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    //verify admin
    const { errorResponse } = await checkAdminAuth(request);
    if (errorResponse) {
      return errorResponse;
    }

    await dbConnect();

    const { orderId } = params;

    //Validate orderId
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return NextResponse.json(
        { success: false, message: "Invalid orderId" },
        { status: 400 }
      );
    }

    //Parse and validate request body
    const body = await request.json();
    const parsed = bodySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: z.treeifyError(parsed.error),
        },
        { status: 400 }
      );
    }

    const { status } = parsed.data;

    //Update the order in database
    const updatedOrder = await OrderModel.findByIdAndUpdate(
      orderId,
      { $set: { status } },
      { new: true }
    ).populate("items.product", "productName price finalPrice");

    //Handle if no order found
    if (!updatedOrder) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    //Return success
    return NextResponse.json(
      {
        success: true,
        message: `Order status updated to '${status}' successfully`,
        data: updatedOrder,
    
      },
      { status: 200 }
    );
  } catch (error) {

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation error while updating order status",
          errors: error.issues,
        },
        { status: 400 }
      );
    }
    console.error("Error in updating order status ", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error in updating order details",
      },
      { status: 500 }
    );
  }
}
