import dbConnect from "@/lib/dbConnect";
import ProductModel from "@/models/products.model";
import RatingModel from "@/models/rating.model";
import { ratingSchema } from "@/schemas/ratingSchema";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

//function for creating and updating rating
export async function POST(request: NextRequest) {
  const session = await getServerSession();
  if (!session?.user?._id) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    await dbConnect();

    const body = await request.json();
    const parsed = ratingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Error in validating rating",
        },
        { status: 400 }
      );
    }

    const { product, rating, review } = parsed.data;

    // prevent empty rating & review
    if (!rating && !review) {
      return NextResponse.json(
        { success: false, message: "Either rating or review is required" },
        { status: 400 }
      );
    }


     const ratingProduct = await RatingModel.findOneAndUpdate(
      { user: session.user._id, product },
      {
        $set: {
          user: session.user._id,
          product,
          rating,
          review,
        },
      },
      { new: true, upsert: true, runValidators: true }
    );

   

    if (!ratingProduct) {
      return NextResponse.json(
        { success: false, message: "Rating not found or could not be created" },
        { status: 404 }
      );
    }


    const stats = await RatingModel.aggregate([
      {
        $match: {
          product: ratingProduct.product,
          rating: { $exists: true, $ne: null }, // exclude reviews without rating
        },
      },
      {
        $group: {
          _id: "$product",
          avgRating: { $avg: "$rating" },
          totalRatings: { $sum: 1 },
        },
      },
    ]);

    const avgRating = stats[0]?.avgRating || 0;
    const totalRatings = stats[0]?.totalRatings || 0;

     //Update the product with new averages
    await ProductModel.findByIdAndUpdate(ratingProduct.product, {
      averageRating: avgRating,
      totalRatings: totalRatings,
    });

    return NextResponse.json({
      success: true,
      message: "Rating saved successfully",
      data: ratingProduct,
    },{status: 200});

  } catch (error) {
    console.error("Error in posting rating ", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error in posting rating",
      },
      { status: 500 }
    );
  }
}





// function for deleting rating and creating average
export async function DELETE(request: NextRequest) {
  const session = await getServerSession();

  //Check if user is logged in
  if (!session?.user?._id) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    await dbConnect();

    //Get productId from query params
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("product");

    if (!productId) {
      return NextResponse.json(
        { success: false, message: "Product ID is required" },
        { status: 400 }
      );
    }

    //Delete the user's rating/review for that product
    const deletedRating = await RatingModel.findOneAndDelete({
      user: session.user._id,
      product: productId,
    });

    if (!deletedRating) {
      return NextResponse.json(
        { success: false, message: "No rating found for this product" },
        { status: 404 }
      );
    }

    //Recalculate the product’s average rating & total ratings
    const stats = await RatingModel.aggregate([
      {
        $match: {
          product: deletedRating.product,
          rating: { $exists: true, $ne: null }, // exclude review-only docs
        },
      },
      {
        $group: {
          _id: "$product",
          avgRating: { $avg: "$rating" },
          totalRatings: { $sum: 1 },
        },
      },
    ]);

    const avgRating = stats[0]?.avgRating || 0;
    const totalRatings = stats[0]?.totalRatings || 0;

    //Update the Product document
    await ProductModel.findByIdAndUpdate(deletedRating.product, {
      averageRating: avgRating,
      totalRatings: totalRatings,
    });

    //Return success response
    return NextResponse.json({
      success: true,
      message: "Rating deleted successfully and average recalculated",
      data: {
        product: deletedRating.product,
        averageRating: avgRating,
        totalRatings: totalRatings,
      },
    });
  } catch (error) {
    console.error("Error deleting rating:", error);
    return NextResponse.json(
      { success: false, message: "Error deleting rating" },
      { status: 500 }
    );
  }
}
