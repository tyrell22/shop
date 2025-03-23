import { type NextRequest, NextResponse } from "next/server";
import { createOrder, addOrderItem } from "@/lib/order-service";
import { createSubscription } from "@/lib/subscription-service";
import { getProductById } from "@/lib/product-service";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import { addDays } from "date-fns";
import { generateOrderConfirmationEmail, sendEmail } from "@/lib/email-service"; // Import email utils

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(request: NextRequest) {
  try {
    // Get the token from cookies
    const token = cookies().get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
    }

    // Verify the token
    const decoded = verify(token, JWT_SECRET) as { id: number; email: string; name: string };

    // Get the request body
    const { productId, paymentMethod } = await request.json();

    // Validate input
    if (!productId || !paymentMethod) {
      return NextResponse.json(
        { success: false, message: "Product ID and payment method are required" },
        { status: 400 }
      );
    }

    // Get the product
    const product = await getProductById(productId);

    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    // Create the order
    const order = await createOrder(decoded.id, product.price, "completed", paymentMethod);

    // Add the order item
    await addOrderItem(order.id, product.id, 1, product.price);

    // Calculate subscription dates
    const startDate = new Date();
    const endDate = addDays(startDate, product.duration_days);

    // Create the subscription
    const subscription = await createSubscription(decoded.id, product.id, startDate, endDate, "active");

    // Send order confirmation email
    const emailTemplate = generateOrderConfirmationEmail(decoded.name, {
      orderId: order.id,
      productName: product.name,
      price: product.price,
      duration: product.duration_days,
      startDate,
      endDate,
    });

    const emailResult = await sendEmail(decoded.email, emailTemplate);
    if (!emailResult.success) {
      console.warn("Email failed to send:", emailResult.message);
      // Don’t fail the checkout if email fails—log it and proceed
    }

    return NextResponse.json({
      success: true,
      order,
      subscription,
    });
  } catch (error) {
    console.error("Error processing checkout:", error);
    return NextResponse.json(
      { success: false, message: "Failed to process checkout", error: String(error) },
      { status: 500 }
    );
  }
}
