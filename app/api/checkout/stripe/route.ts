if (!process.env.STRIPE_SECRET_KEY) {
  console.warn("Missing STRIPE_SECRET_KEY environment variable")
}

import { type NextRequest, NextResponse } from "next/server"
import stripe from "@/lib/stripe"
import { getProductById } from "@/lib/product-service"
import { getAuthUserId } from "@/lib/auth-utils"

export async function POST(request: NextRequest) {
  try {
    // Get the authenticated user
    const userId = await getAuthUserId(request)

    if (!userId) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 })
    }

    // Get the request body
    const { productId } = await request.json()

    if (!productId) {
      return NextResponse.json({ success: false, message: "Product ID is required" }, { status: 400 })
    }

    // Get the product
    const product = await getProductById(productId)

    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 })
    }

    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.name,
              description: product.description,
              metadata: {
                product_id: product.id,
              },
            },
            unit_amount: Math.round(product.price * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${request.headers.get("origin")}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get("origin")}/packages`,
      metadata: {
        user_id: userId,
        product_id: product.id,
        duration_days: product.duration_days,
      },
    })

    return NextResponse.json({ success: true, sessionId: session.id, url: session.url })
  } catch (error) {
    console.error("Error creating checkout session:", error)
    return NextResponse.json(
      { success: false, message: "Failed to create checkout session", error: String(error) },
      { status: 500 },
    )
  }
}

