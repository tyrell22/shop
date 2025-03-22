import { type NextRequest, NextResponse } from "next/server"
import { getProductById, updateProduct, deleteProduct } from "@/lib/product-service"
import { getAuthUserId } from "@/lib/auth-utils"
import { isAdmin } from "@/lib/admin-utils"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const productId = Number.parseInt(params.id)

    if (isNaN(productId)) {
      return NextResponse.json({ success: false, message: "Invalid product ID" }, { status: 400 })
    }

    const product = await getProductById(productId)

    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, product })
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json(
      { success: false, message: "Failed to fetch product", error: String(error) },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const productId = Number.parseInt(params.id)

    if (isNaN(productId)) {
      return NextResponse.json({ success: false, message: "Invalid product ID" }, { status: 400 })
    }

    // Check if user is authenticated and is admin
    const userId = await getAuthUserId(request)
    if (!userId) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 })
    }

    const admin = await isAdmin(userId)
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 })
    }

    // Get the request body
    const data = await request.json()

    // Update the product
    const product = await updateProduct(productId, {
      name: data.name,
      description: data.description,
      price: data.price !== undefined ? Number(data.price) : undefined,
      duration_days: data.duration_days !== undefined ? Number(data.duration_days) : undefined,
      features: data.features,
      meta_title: data.meta_title,
      meta_description: data.meta_description,
      focus_keywords: data.focus_keywords,
      seo_slug: data.seo_slug,
      canonical_url: data.canonical_url,
      og_image_url: data.og_image_url,
    })

    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, product })
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json(
      { success: false, message: "Failed to update product", error: String(error) },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const productId = Number.parseInt(params.id)

    if (isNaN(productId)) {
      return NextResponse.json({ success: false, message: "Invalid product ID" }, { status: 400 })
    }

    // Check if user is authenticated and is admin
    const userId = await getAuthUserId(request)
    if (!userId) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 })
    }

    const admin = await isAdmin(userId)
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 })
    }

    // Delete the product
    const success = await deleteProduct(productId)

    if (!success) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Product deleted successfully" })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json(
      { success: false, message: "Failed to delete product", error: String(error) },
      { status: 500 },
    )
  }
}

