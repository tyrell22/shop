import { type NextRequest, NextResponse } from "next/server";
import { createOrder, getUserOrders } from "@/lib/order-service";
import { requireAuth } from "@/lib/auth-middleware";

export async function GET() {
  try {
    // Check authentication
    const authResult = await requireAuth();
    
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: authResult.message },
        { status: authResult.status }
      );
    }

    // Get the user's orders
    const orders = await getUserOrders(authResult.user.id);

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch orders", error: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authResult = await requireAuth();
    
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: authResult.message },
        { status: authResult.status }
      );
    }

    // Get the request body
    const { totalAmount, status, paymentMethod } = await request.json();

    // Validate input
    if (!totalAmount || !status || !paymentMethod) {
      return NextResponse.json(
        { success: false, message: "Total amount, status, and payment method are required" },
        { status: 400 }
      );
    }

    // Create the order
    const order = await createOrder(authResult.user.id, totalAmount, status, paymentMethod);

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create order", error: String(error) },
      { status: 500 }
    );
  }
}