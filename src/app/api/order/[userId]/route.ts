import dbConnect from "@/lib/dbConnect";
import OrderModel from "@/models/order.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request : NextRequest , {params} : {params: {userId : string}}){
    try {

        await dbConnect()

        const { userId } = params;
        
        if(!mongoose.Types.ObjectId.isValid(userId)){
            return NextResponse.json({
                success: false,
                message: "Invalid userId"
            }, {status: 400})
        }

        const orders = await OrderModel.find({user: userId}).populate("items.product").sort({createdAt : -1})
        if(!orders || orders.length === 0){
            return NextResponse.json({
                success: false,
                message: "Order not found"
            }, {status: 404})
        }

        return NextResponse.json({
            success: true,
            message: "Order fetched Successfully",
            data: orders,
            orderCount: orders.length,
        }, {status: 200})


    } catch (error) {
        console.error("Error in fetching preivous orders ", error)
        return NextResponse.json({
            success: false,
            message: "Error in fetching previous orders"
        },{status: 500})
    }
}