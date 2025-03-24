import { type NextRequest, NextResponse } from "next/server";
import stripe from "@/lib/stripe";
import { createOrder, addOrderItem } from "@/lib/order-service";
import { createSubscription } from "@/lib/subscription-service";
import { getUserById } from "@/lib/user-service";
import { getProductById } from "@/lib/product-service";
import { sendEmail, generateOrderConfirmationEmail } from "@/lib/email-service";
import { addDays } from "date-fns";
import { Pool } from "pg";

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Neon connection string from Vercel env
  ssl: { rejectUnauthorized: false }, // Required for Neon
});

export async function POST(request: NextRequest) {
  console.log("Webhook request received at /api/webhooks/stripe");

  const payload = await request.text();
  const sig = request.headers.get("stripe-signature") || "";

  if (!sig || !STRIPE_WEBHOOK_SECRET) {
    console.error("Missing webhook signature or secret");
    return NextResponse.json({ success: false, message: "Missing webhook signature or secret" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(payload, sig, STRIPE_WEBHOOK_SECRET);
    console.log("Webhook event verified:", event.type);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return NextResponse.json({ success: false, message: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;
    console.log("Session data:", session);

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      let userId;
      const isGuestCheckout = session.metadata.user_id === 'guest';
      
      // Handle guest checkout
      if (isGuestCheckout) {
        // Create a temporary user for guest checkout
        const guestEmail = session.metadata.guest_email || session.customer_details.email;
        const guestName = session.metadata.guest_name || session.customer_details.name || "Guest";
        
        if (!guestEmail) {
          throw new Error("Guest email is required for checkout");
        }
        
        // Check if email exists to avoid duplicates
        const existingUserCheck = await client.query(
          "SELECT id FROM users WHERE email = $1", 
          [guestEmail]
        );
        
        if (existingUserCheck.rows.length > 0) {
          // If user exists, use that ID
          userId = existingUserCheck.rows[0].id;
          console.log("Using existing user with ID:", userId);
        } else {
          // Otherwise create a new user
          const guestUserResult = await client.query(
            "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id",
            [guestName, guestEmail, "GUEST_USER"]
          );
          userId = guestUserResult.rows[0].id;
          console.log("Created guest user with ID:", userId);
        }
      } else {
        userId = Number(session.metadata.user_id);
      }
      
      const productId = Number(session.metadata.product_id);
      const durationDays = Number(session.metadata.duration_days);
      const totalAmount = session.amount_total / 100;

      console.log("Processing fulfillment for user:", userId, "product:", productId);

      const orderResult = await client.query(
        "INSERT INTO orders (user_id, total_amount, status, payment_method) VALUES ($1, $2, $3, $4) RETURNING *",
        [userId, totalAmount, "completed", session.payment_method_types[0]]
      );
      const order = orderResult.rows[0];
      console.log("Order created:", order);

      const orderItemResult = await client.query(
        "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4) RETURNING *",
        [order.id, productId, 1, totalAmount]
      );
      const orderItem = orderItemResult.rows[0];
      console.log("Order item added:", orderItem);

      const startDate = new Date();
      const endDate = addDays(startDate, durationDays);
      const subscriptionResult = await client.query(
        "INSERT INTO subscriptions (user_id, product_id, start_date, end_date, status) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [userId, productId, startDate, endDate, "active"]
      );
      const subscription = subscriptionResult.rows[0];
      console.log("Subscription created:", subscription);

      await client.query("COMMIT");
      console.log("Transaction committed");

      // Send confirmation email
      try {
        const user = await getUserById(userId);
        const product = await getProductById(productId);
        console.log("User:", user, "Product:", product);

        if (user && product) {
          const emailTemplate = generateOrderConfirmationEmail(user.name, {
            orderId: order.id,
            productName: product.name,
            price: totalAmount,
            duration: durationDays,
            startDate: new Date(subscription.start_date),
            endDate: new Date(subscription.end_date),
          });
          
          // Get email - either from user record or session data
          const emailTo = user.email || session.metadata.guest_email || session.customer_details.email;
          console.log("Sending email to:", emailTo);
          
          const emailResult = await sendEmail(emailTo, emailTemplate);
          if (!emailResult.success) {
            console.error("Email failed:", emailResult.message, emailResult.error);
          } else {
            console.log("Email sent successfully");
          }
        } else {
          console.warn("User or product not found for email:", { userId, productId });
        }
      } catch (emailError) {
        console.error("Error sending confirmation email:", emailError);
        // We continue with order completion even if email fails
      }

      console.log(`Order fulfilled for user ${userId}, product ${productId}`);
      return NextResponse.json({ success: true, received: true });
    } catch (error: any) {
      console.error("Error fulfilling order:", error);
      await client.query("ROLLBACK");
      return NextResponse.json(
        { success: false, message: "Failed to fulfill order", error: error.message },
        { status: 500 }
      );
    } finally {
      client.release();
    }
  }

  console.log("Unhandled event type:", event.type);
  return NextResponse.json({ success: true, received: true });
}

export const config = {
  api: {
    bodyParser: false,
  },
};