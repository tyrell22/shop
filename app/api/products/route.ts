import { type NextRequest, NextResponse } from "next/server";
import { getProducts, createProduct } from "@/lib/product-service";
import { getAuthUserId } from "@/lib/auth-utils";
import { isAdmin } from "@/lib/admin-utils";

export async function GET() {
  try {
    const products = await getProducts();
    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch products", error: String(error) },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated and is admin
    const userId = await getAuthUserId(request);

    console.log("User ID from auth:", userId);

    if (!userId) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
    }

    const admin = await isAdmin(userId);

    console.log("Is admin:", admin);

    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    // Get the request body
    const body = await request.text();
    console.log("Raw request body:", body);

    let data;
    try {
      data = JSON.parse(body);
    } catch (e) {
      console.error("Error parsing JSON:", e);
      return NextResponse.json({ success: false, message: "Invalid JSON in request body" }, { status: 400 });
    }

    console.log("Parsed product data:", data);

    // Validate required fields - only name and price
    if (!data.name) {
      return NextResponse.json({ success: false, message: "Name is required" }, { status: 400 });
    }

    if (data.price === undefined || isNaN(Number(data.price))) {
      return NextResponse.json({ success: false, message: "Valid price is required" }, { status: 400 });
    }

    // Set defaults for optional fields
    const duration_days = data.duration_days !== undefined ? Number(data.duration_days) : 30;
    const features = Array.isArray(data.features) && data.features.length > 0 ? data.features : ["Basic Package"];

    // Create the product
    try {
      const product = await createProduct(
        data.name,
        data.description || "",
        Number(data.price),
        duration_days,
        features,
      );

      console.log("Product created:", product);
      return NextResponse.json({ success: true, product });
    } catch (dbError) {
      console.error("Database error creating product:", dbError);
      return NextResponse.json({ success: false, message: `Database error: ${dbError.message}` }, { status: 500 });
    }
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ success: false, message: `Failed to create product: ${error.message}` }, { status: 500 });
  }
}
