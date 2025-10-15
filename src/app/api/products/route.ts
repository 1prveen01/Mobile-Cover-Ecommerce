import dbConnect from "@/lib/dbConnect";
import ProductModel from "@/models/products.model";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Get all products with search, pagination and category filter (public)
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    // Base query excluding deleted products
    const query: any = { isDeleted: false };

    // Filter by category
    if (category) query.productCategory = category;

    // Use MongoDB text search
    if (search) {
      query.$text = { $search: search };
    }

    // Fetch products with pagination
    const products = await ProductModel.find(query, search ? { score: { $meta: "textScore" } } : {})
      .sort(search ? { score: { $meta: "textScore" } } : {})
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("productCategory");

    const total = await ProductModel.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching products", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong while fetching products." },
      { status: 500 }
    );
  }
}
