import dbConnect from "@/lib/dbConnect";
import WishlistModel from "@/models/wishlist.model";
import { NextRequest, NextResponse } from "next/server";


//function for removing a product from wishlist
export async function DELETE(request : NextRequest , {params} : {params : {productId: string}}){

    try {

        await dbConnect()

        const {productId} = params;
        const { searchParams } = new URL(request.url)

        const userId = searchParams.get("userId")
        if(!productId){
            return NextResponse.json({
                success: false,
                message: "ProductId is required in the url "
            },{status: 400})
        }
        if(!userId){
            return NextResponse.json({
                success: false,
                message: "UserId query param is required "
            },{status: 400})
        }

        const deleted = await WishlistModel.findOneAndDelete({user: userId , product: productId})

        if(!deleted){
            return NextResponse.json({
                success: false,
                message: "product not found in wishlist "
            },{status: 404})
        }

        return NextResponse.json({
            success: true,
            message: "Product removed successfully form wishlist",

        },{status: 200})

    } catch (error) {
        console.error("Error while deleting product from wishlist ", error)
        return NextResponse.json({
            success: false,
            message: "Error while deleting product from wishlist "
        },{status: 500})   
    }
}