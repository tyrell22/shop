import { NextResponse } from "next/server"
import { createProduct, getProducts } from "@/lib/product-service"

export async function GET() {
  try {
    // Check if products already exist
    const existingProducts = await getProducts()

    if (existingProducts.length > 0) {
      return NextResponse.json({
        success: true,
        message: "Products already exist",
        count: existingProducts.length,
        products: existingProducts,
      })
    }

    // Define the products to seed
    const productsToSeed = [
      {
        name: "Basic",
        description: "Perfect for casual viewers",
        price: 9.99,
        duration_days: 30,
        features: ["1000+ Channels", "HD Quality", "24/7 Support", "1 Device", "7-day Catch-up"],
      },
      {
        name: "Standard",
        description: "Our most popular package",
        price: 14.99,
        duration_days: 30,
        features: ["2000+ Channels", "HD & FHD Quality", "24/7 Support", "2 Devices", "VOD Access", "14-day Catch-up"],
      },
      {
        name: "Premium",
        description: "The ultimate viewing experience",
        price: 19.99,
        duration_days: 30,
        features: [
          "3000+ Channels",
          "HD, FHD & 4K Quality",
          "24/7 Priority Support",
          "4 Devices",
          "VOD & Series Access",
          "PPV Events",
          "30-day Catch-up",
        ],
      },
      {
        name: "Basic Annual",
        description: "Basic package with annual discount",
        price: 99.99,
        duration_days: 365,
        features: ["1000+ Channels", "HD Quality", "24/7 Support", "1 Device", "7-day Catch-up", "Save over 16%"],
      },
      {
        name: "Standard Annual",
        description: "Standard package with annual discount",
        price: 149.99,
        duration_days: 365,
        features: [
          "2000+ Channels",
          "HD & FHD Quality",
          "24/7 Support",
          "2 Devices",
          "VOD Access",
          "14-day Catch-up",
          "Save over 16%",
        ],
      },
      {
        name: "Premium Annual",
        description: "Premium package with annual discount",
        price: 199.99,
        duration_days: 365,
        features: [
          "3000+ Channels",
          "HD, FHD & 4K Quality",
          "24/7 Priority Support",
          "4 Devices",
          "VOD & Series Access",
          "PPV Events",
          "30-day Catch-up",
          "Save over 16%",
        ],
      },
    ]

    // Seed the products
    const createdProducts = []

    for (const product of productsToSeed) {
      const createdProduct = await createProduct(
        product.name,
        product.description,
        product.price,
        product.duration_days,
        product.features,
      )

      createdProducts.push(createdProduct)
    }

    return NextResponse.json({
      success: true,
      message: "Products seeded successfully",
      count: createdProducts.length,
      products: createdProducts,
    })
  } catch (error) {
    console.error("Error seeding products:", error)
    return NextResponse.json(
      { success: false, message: "Failed to seed products", error: String(error) },
      { status: 500 },
    )
  }
}

