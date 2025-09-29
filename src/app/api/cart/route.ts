import dbConnect from "@/lib/dbConnect";
import ProductModel from "@/models/products.model";
import mongoose from "mongoose";
import { NextRequest , NextResponse} from "next/server";
import { success } from "zod";
import UserModel from "@/models/users.model";
import CartModel from "@/models/cart.model";



export async function POST(request:NextRequest, {params}: {params: {id: string}}) {

    try {
        await dbConnect()

        const body = await request.json()

        const {userId , productId , quantity } = body;

        //validating userId and productId
        if(!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)){
            return NextResponse.json({
                success: false,
                message: "Invalid UserId or ProductId"
            }, {status: 400})
        }

        //finding product with productId if exist
        const product = await ProductModel.findById(productId)
        if(!product){
            return NextResponse.json({
                success: false,
                message: "Product not found"
            },{status: 404})
        }

        //finding cart related to user if exist using userId
        let cart = await UserModel.findOne({user: userId})
        if(!cart){
            
            //create a new cart
            cart = new CartModel({
                user: userId,
                items
            })
        }




        
    } catch (error) {
        console.error("Error while adding product to cart ", error)
        return NextResponse.json({
            success:false,
            message:"Error while adding product to cart"

        }, {
            status: 500
        })
    }
    
}