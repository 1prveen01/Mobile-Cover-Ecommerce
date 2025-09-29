
import dbConnect from "@/lib/dbConnect";
import CategoryModel from "@/models/category.model";
import { NextRequest , NextResponse } from "next/server";
import mongoose from "mongoose";

//validating the parameter id
const isValidObjectId = (id: string) => {
  return mongoose.Types.ObjectId.isValid(id);
};

export async function PATCH(request: NextRequest, {params}:{params : {id: string}}){

    try {
        await dbConnect()
        if(!isValidObjectId(params.id)){
            return NextResponse.json({
                success: false,
                message: "Invalid object Id"
            }, {status: 400})
        }

        const category = await CategoryModel.findByIdAndUpdate(params.id,{$set : {isDeleted: false}}, {new: true})
        if(!category){
            return NextResponse.json({
                success: false,
                message: "Category not found",
                
            }, {status: 404})
        }

        return NextResponse.json({
            success: true,
            message: "Category restored successfully",
            data: category,
        }, {status: 200})
        
    } catch (error) {
        console.error("Error while restoring category ", error)
        return NextResponse.json({
            success: false,
            message: "Error while restoring category"
        }, {status: 500})
    }
}