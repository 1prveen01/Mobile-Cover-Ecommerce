

import dbConnect from "@/lib/dbConnect";
import CartModel from "@/models/cart.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";


//function for deleting a product
export async function DELETE(request:NextRequest , {params}:{params: { userId : string , productId:string}}){

    try {

        await dbConnect()

        //validating productId
        const {userId , productId} = params;
        if(!mongoose.Types.ObjectId.isValid(productId) || !mongoose.Types.ObjectId.isValid(userId)){
            return NextResponse.json({
                success: false,
                message: "Invalid productId or userId"
            }, {status: 400})
        }

        //find cart
        const cart = await CartModel.findOne({user: userId})
        if(!cart){
            return NextResponse.json({
                success: false,
                message: "Cart not found"
            }, {status: 404})
        }

        //remove product from cart Items
        const initialLength = cart.items.length

        cart.items = cart.items.filter((item) => item.product.toString() !== productId)

        if(cart.items.length == initialLength){
            return NextResponse.json({
                success:false,
                message : "Product not found in cart"
            }, {status:404
            })
        }
        await cart.save()
        await cart.populate("items.product")
        
        return NextResponse.json({
            success:true,
            message: "Product deleted from cart successfully",
            data: cart,
        }, {status: 200})
                
    } catch (error) {
        console.error("Error in deleting product from cart ", error)
        return NextResponse.json({
            success: false,
            message: "Error in deleting product from cart"
        }, {status: 500})
    }
}



//for updating quantity of product
export async function PATCH(request:NextRequest, {params}:{params:{userId:string , productId: string}}){
    try {

        await dbConnect()

        const { userId , productId} = params;
        const { quantity } = await request.json();


        if(!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)){
            return NextResponse.json({
                success: false,
                message: "Invalid productId or userId"
            }, {status: 400})
        }

        const cart = await CartModel.findOne({user: userId})
        if(!cart){
            return NextResponse.json({
                success : false,
                message: "Cart not found"
            }, {status: 404})
        }

        //find items inside of cart
        const item = cart.items.find((item) => item.product.toString()  === productId)

        if(!item){
            return NextResponse.json({
                success: false,
                message: "Product not found in cart"
            }, {status: 404})
        }

        item.quantity = quantity;

        await cart.save()
        await cart.populate("items.product")

        return NextResponse.json({
            success: true,
            message: "Cart updated successfully",
            data: cart,
        }, {status: 200})

    } catch (error) {
        console.error("Error while updating product in cart", error)
        return NextResponse.json({
            success: false,
            meassge: "Error while updating product in cart "
        }, {status: 500})
    }
}