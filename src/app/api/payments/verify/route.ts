import dbConnect from "@/lib/dbConnect";
import { verifyPaymentSchema } from "@/schemas/paymentSchema";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import PaymentModel from "@/models/payment.model";
import {z} from "zod"



//function for verify razorpay payment
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const parsed = verifyPaymentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Error in parsing the body request ",
        },
        { status: 400 }
      );
    }

    const { razorpay_order_id, razorpay_signature, razorpay_payment_id } =
      parsed.data;

    // Verify signature
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      throw new Error("RAZORPAY_KEY_SECRET is not defined in environment variables");
    }
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return NextResponse.json({
        success: false,
        message: "Invalid signature",
      });
    }

    //Update the payment record you created earlier
    await PaymentModel.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        razorpayPaymentId: razorpay_payment_id,
        status: "paid",
      }
    );

    return NextResponse.json({ success: true, message: "Payment verified" });
  } catch (error) {

    if(error instanceof z.ZodError){
        return NextResponse.json({
            success: false,
            message: "Error in validating verify razorpay payment"
        },{status: 400})
    }
    console.error("Error in verifying razorpay payment ", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error in verifying razorpay payment",
      },
      { status: 500 }
    );
  }
}
