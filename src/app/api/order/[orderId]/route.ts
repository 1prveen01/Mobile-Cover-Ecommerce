import dbConnect from "@/lib/dbConnect";
import OrderModel from "@/models/order.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request : NextRequest , {params}: {params : {orderId : string}}){

    try {

        await dbConnect()

        const { orderId } = params;
        if(!mongoose.Types.ObjectId.isValid(orderId)){
            return NextResponse.json({
                success: false,
                message: "Invalid orderId"
            }, {status: 400})
        }

        const order = await OrderModel.findById(orderId).populate("items.product", "productName price finalPrice productImage").select("-_v")
        if(!order){
            return NextResponse.json({
                success: false,
                message: "Order not found"
            }, {status: 404})
        }

        return NextResponse.json({
            success: true,
            message: "Order Details fetched successfully", 
            data: order,
        }, {status: 200})

    } catch (error) {
        console.error("Error in fetching order details ", error)
        return NextResponse.json({
            success: false,
            message: "Error in fetching order details",
        }, {status: 500})
    }
}