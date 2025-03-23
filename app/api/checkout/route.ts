import { type NextRequest, NextResponse } from "next/server";
import { createOrder, addOrderItem } from "@/lib/order-service";
import { createSubscription } from "@/lib/subscription-service";
import { getProductById } from "@/lib/product-service";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import { addDays } from "date-fns";
import { generateOrderConfirmationEmail, sendEmail } from "@/lib/email-service";
import { query } from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(request: NextRequest) {
  console.log("Checkout request received");
  const client = await query("BEGIN");

  try {
    const token = cookies().get("auth_token")?.value;
    if (!token) {
      await query("ROLLBACK");
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
    }

    const decoded = verify(token, JWT_SECRET) as { id: number; email: string; name: string };
    console.log("User:", decoded);

    const { productId, paymentMethod } = await request.json();
    console.log("Request body:", { productId, paymentMethod });
    if (!productId || !paymentMethod) {
      await query("ROLLBACK");
      return NextResponse.json(
        { success: false, message: "Product ID and payment method are required" },
        { status: 400 }
      );
    }

    const product = await getProductById(productId);
    if (!product) {
      await query("ROLLBACK");
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }
    console.log("Product:", product);

    const order = await createOrder(decoded.id, product.price, "completed", paymentMethod);
    console.log("Order created:", order);

    const orderItem = await addOrderItem(order.id, product.id, 1, product.price);
    console.log("Order item added:", orderItem);

    const startDate = new Date();
    const endDate = addDays(startDate, product.duration_days);
    console.log("Subscription dates:", { startDate, endDate });
    const subscription = await createSubscription(decoded.id, product.id, startDate, endDate, "active");
    console.log("Subscription created:", subscription);

    await query("COMMIT");
    console.log("Transaction committed");

    const emailTemplate = generateOrderConfirmationEmail(decoded.name, {
      orderId: order.id,
      productName: product.name,
      price: product.price,
      duration: product.duration_days,
      startDate,
      endDate,
    });
    console.log("Sending email to:", decoded.email);
    const emailResult = await sendEmail(decoded.email, emailTemplate);
    if (!emailResult.success) {
      console.error("Email failed:", emailResult.message, emailResult.error);
    } else {
      console.log("Email sent successfully");
    }

    return NextResponse.json({
      success: true,
      order,
      subscription,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    await query("ROLLBACK");
    return NextResponse.json(
      { success: false, message: "Failed to process checkout", error: String(error) },
      { status: 500 }
    );
  }
}
