import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

// GET endpoint to fetch all categories
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Fetch categories error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch categories",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// POST endpoint to create a new category
export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const body = await request.json();
    const { name, description, image } = body;

    // Validate required fields
    if (!name || !description) {
      return NextResponse.json(
        { error: "Name and description are required" },
        { status: 400 }
      );
    }

    // Create the category
    const category = await prisma.category.create({
      data: {
        name,
        description,
        image: image || null,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error("Create category error:", error);
    return NextResponse.json(
      {
        error: "Failed to create category",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}