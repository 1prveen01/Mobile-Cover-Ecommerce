import dbConnect from "@/lib/dbConnect";
import ProductModel from "@/models/products.model";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { productSchema } from "@/schemas/productSchema";

// Create a new product
export async function POST(request: NextRequest) {
  await dbConnect();

  const body = await request.json();

  try {
    // Validate request body
    const validatedData = productSchema.parse(body);

    // Calculate final price
    const finalPrice = validatedData.discount
      ? validatedData.price - (validatedData.price * validatedData.discount) / 100
      : validatedData.price;

    const newProduct = new ProductModel({ ...validatedData, finalPrice });
    await newProduct.save();

    return NextResponse.json(
      {
        success: true,
        message: "Product created successfully",
        data: newProduct,
      },
      { status: 201 }
    );
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: "Validation failed while creating the product", errors: err.issues },
        { status: 400 }
      );
    }

    console.error("Error creating Product", err);
    return NextResponse.json(
      { success: false, message: "Something went wrong while creating the product" },
      { status: 500 }
    );
  }
}

// Get all products with search, pagination and category filter
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
