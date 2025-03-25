import { type NextRequest, NextResponse } from "next/server"
import { getProducts, createProduct } from "@/lib/product-service"
import { verify } from "jsonwebtoken"
import { cookies } from "next/headers"
import { jwtConfig } from "@/lib/config"

export async function GET() {
  try {
    const products = await getProducts()
    return NextResponse.json({ success: true, products })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json(
      { success: false, message: "Failed to fetch products", error: String(error) },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get the token from cookies
    const token = cookies().get(jwtConfig.cookieName)?.value

    if (!token) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 })
    }

    // Verify the token
    const decoded = verify(token, jwtConfig.secret) as { 
      id: number; 
      email: string; 
      name: string;
      isAdmin?: boolean;
    }

    // Check if user is admin
    if (!decoded.isAdmin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 })
    }

    // Get the request body
    const body = await request.text()
    console.log("Raw request body:", body)

    let data
    try {
      data = JSON.parse(body)
    } catch (e) {
      console.error("Error parsing JSON:", e)
      return NextResponse.json({ success: false, message: "Invalid JSON in request body" }, { status: 400 })
    }

    console.log("Parsed product data:", data)

    // Validate required fields - only name and price
    if (!data.name) {
      return NextResponse.json({ success: false, message: "Name is required" }, { status: 400 })
    }

    if (data.price === undefined || isNaN(Number(data.price))) {
      return NextResponse.json({ success: false, message: "Valid price is required" }, { status: 400 })
    }

    // Set defaults for optional fields
    const duration_days = data.duration_days !== undefined ? Number(data.duration_days) : 30
    const features = Array.isArray(data.features) && data.features.length > 0 ? data.features : ["Basic Package"]

    // Create the product
    try {
      const product = await createProduct(
        data.name,
        data.description || "",
        Number(data.price),
        duration_days,
        features,
        {
          meta_title: data.meta_title,
          meta_description: data.meta_description,
          focus_keywords: data.focus_keywords,
          seo_slug: data.seo_slug,
          canonical_url: data.canonical_url,
          og_image_url: data.og_image_url
        }
      )

      console.log("Product created:", product)
      return NextResponse.json({ success: true, product })
    } catch (dbError) {
      console.error("Database error creating product:", dbError)
      return NextResponse.json({ success: false, message: `Database error: ${dbError.message}` }, { status: 500 })
    }
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ success: false, message: `Failed to create product: ${error.message}` }, { status: 500 })
  }
}