

import dbConnect from "@/lib/dbConnect";
import CategoryModel from "@/models/category.model";
import { NextResponse } from "next/server";

export async function DELETE() {
  try {
    await dbConnect();

    const result = await CategoryModel.deleteMany({
      isDeleted: true,
      deletedAt: { $lte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }, // 7 days
    });

    return NextResponse.json(
      {
        success: true,
        message: "Old categories cleaned up",
        deletedCount: result.deletedCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(" Error cleaning up categories:", error);
    return NextResponse.json(
      { success: false, message: "Error cleaning up categories" },
      { status: 500 }
    );
  }
}
