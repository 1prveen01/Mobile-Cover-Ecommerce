import dbConnect from "@/lib/dbConnect";
import WishlistModel from "@/models/wishlist.model";
import { wishlistSchema } from "@/schemas/wishlistSchema";
import { Instrument_Sans } from "next/font/google";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

//function for adding product in wislist
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();

    //validating product
    const parsed = wishlistSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Error in validating in wishlist",
        },
        { status: 400 }
      );
    }

    const { product, user } = parsed.data;

    const existing = await WishlistModel.findOne({ user, product });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "Product already in wishlist" },
        { status: 409 }
      );
    }

    const wishlist = await WishlistModel.create({
      user,
      product,
    });

    return NextResponse.json(
      {
        success: true,
        message: "wishlist created successfully",
        data: wishlist,
      },
      { status: 201}
    );
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: "Error ",
      });
    }
    if (error.code === 11000) {
      // MongoDB duplicate key error
      return NextResponse.json({
        success: false,
        message: "Product already in wishlist",
      });
    }

    console.error("Error in adding product to wishlist ", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error in adding products to wishlist",
      },
      { status: 500 }
    );
  }
}

//function for fetching all products in wishlist
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: " UserId query param is required",
        },
        { status: 400 }
      );
    }

    const wishlist = await WishlistModel.find({ user: userId })
      .populate("product")
      .sort({ createdAt: -1 })
      .lean();

  
    if (wishlist.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No products found in wishlist",
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Products fetched successfully",
        data: wishlist,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in fetching products in wishlist ", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error in fetching products in wishlist",
      },
      { status: 500 }
    );
  }
}
