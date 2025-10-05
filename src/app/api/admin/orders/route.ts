import { checkAdminAuth } from "@/lib/checkAdminAuth";
import dbConnect from "@/lib/dbConnect";
import OrderModel from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

//function for getting all orders with pagination(Admin only)
export async function GET(request: NextRequest) {
  try {
    //verify admin
    const { session, errorResponse } = await checkAdminAuth(request);
    if (errorResponse) return errorResponse;

    await dbConnect();

    //Get query params
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1"); // default 1
    const limit = parseInt(searchParams.get("limit") || "10"); // default 10

    //number of pages to skip
    const skip = (page - 1) * limit;

    const orders = await OrderModel.find()
      .populate("user", "fullName email mobileNumber ")
      .select("-__v")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    //get totalOrders for pagination
    const totalOrders = await OrderModel.countDocuments();

    if (!orders || orders.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No orders found",
        },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        success: true,
        message: "Orders fetched from users successfully ",
        data: orders,
        pagination: {
          totalOrders,
          currentPage: page,
          totalPages: Math.ceil(totalOrders / limit),
          limit,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in fetching orders from users ", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error in fetching orders from users",
      },
      { status: 500 }
    );
  }
}
