import dbConnect from "@/lib/dbConnect";
import { createPaymentSchema } from "@/schemas/paymentSchema";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { razorpay } from "@/lib/razorpay";
import PaymentModel from "@/models/payment.model";
import OrderModel from "@/models/order.model";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const parsed = createPaymentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Error in parsed the body request",
        },
        { status: 400 }
      );
    }

    const { user, order, amount } = parsed.data;
    const options = {
      amount: amount * 100, // convert to paise
      currency: "INR",
      receipt: `order_rcptid_${order}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Save to PaymentModel
    const payment = await PaymentModel.create({
      user,
      order,
      amount,
      razorpayOrderId: razorpayOrder.id,
      status: "created",
    });

    return NextResponse.json({
      success: true,
      message: "Razorpay order created successfully",
      data: {
        key: process.env.RAZORPAY_KEY_ID,
        orderId: razorpayOrder.id,
        amount,
        currency: "INR",
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return z.treeifyError(error);
    }

    console.error("Error in creating error ", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error in creating order",
      },
      { status: 500 }
    );
  }
}
