import dbConnect from "@/lib/dbConnect";
import WishlistModel from "@/models/wishlist.model";
import { wishlistSchema } from "@/schemas/wishlistSchema";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    //  query params
    const { searchParams } = new URL(request.url);
    const user = searchParams.get("userId");
    const product = searchParams.get("productId");

    // Validate query parameters schema
    const parsed = wishlistSchema.safeParse({ user, product });

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid query parameters",
          errors: z.treeifyError(parsed.error)
        },
        { status: 400 }
      );
    }

    const { user: userId, product: productId } = parsed.data;

    // Check if the product exists in the user's wishlist
    const exists = await WishlistModel.exists({ user: userId, product: productId });

    return NextResponse.json(
      {
        success: true,
        message: "Checked product in wishlist successfully",
        inWishlist: !!exists,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking product in wishlist:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error checking product in wishlist",
      },
      { status: 500 }
    );
  }
}
