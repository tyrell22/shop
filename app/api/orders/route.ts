import { type NextRequest, NextResponse } from "next/server"
import { createOrder, getUserOrders } from "@/lib/order-service"
import { verify } from "jsonwebtoken"
import { cookies } from "next/headers"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function GET() {
  try {
    // Get the token from cookies
    const token = cookies().get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 })
    }

    // Verify the token
    const decoded = verify(token, JWT_SECRET) as { id: number; email: string; name: string }

    // Get the user's orders
    const orders = await getUserOrders(decoded.id)

    return NextResponse.json({ success: true, orders })
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json(
      { success: false, message: "Failed to fetch orders", error: String(error) },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get the token from cookies
    const token = cookies().get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 })
    }

    // Verify the token
    const decoded = verify(token, JWT_SECRET) as { id: number; email: string; name: string }

    // Get the request body
    const { totalAmount, status, paymentMethod } = await request.json()

    // Validate input
    if (!totalAmount || !status || !paymentMethod) {
      return NextResponse.json(
        { success: false, message: "Total amount, status, and payment method are required" },
        { status: 400 },
      )
    }

    // Create the order
    const order = await createOrder(decoded.id, totalAmount, status, paymentMethod)

    return NextResponse.json({ success: true, order })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json(
      { success: false, message: "Failed to create order", error: String(error) },
      { status: 500 },
    )
  }
}

