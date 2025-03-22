import { type NextRequest, NextResponse } from "next/server"
import stripe from "@/lib/stripe"
import { createOrder, addOrderItem } from "@/lib/order-service"
import { createSubscription } from "@/lib/subscription-service"
import { getUserById } from "@/lib/user-service"
import { getProductById } from "@/lib/product-service"
import { sendEmail, generateOrderConfirmationEmail } from "@/lib/email-service"
import { addDays } from "date-fns"

// This is your Stripe webhook secret for testing your endpoint locally.
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || ""

export async function POST(request: NextRequest) {
  const payload = await request.text()
  const sig = request.headers.get("stripe-signature") || ""

  let event

  try {
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret)
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`)
    return NextResponse.json({ success: false, message: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  // Handle the checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any

    // Fulfill the order
    try {
      const userId = Number(session.metadata.user_id)
      const productId = Number(session.metadata.product_id)
      const durationDays = Number(session.metadata.duration_days)
      const totalAmount = session.amount_total / 100 // Convert from cents to dollars

      // Create the order
      const order = await createOrder(userId, totalAmount, "completed", session.payment_method_types[0])

      // Add the order item
      await addOrderItem(order.id, productId, 1, totalAmount)

      // Calculate subscription dates
      const startDate = new Date()
      const endDate = addDays(startDate, durationDays)

      // Create the subscription
      const subscription = await createSubscription(userId, productId, startDate, endDate, "active")

      // Get user and product details for the email
      const user = await getUserById(userId)
      const product = await getProductById(productId)

      // Send order confirmation email if user and product exist
      if (user && product) {
        const emailTemplate = generateOrderConfirmationEmail(user.name, {
          orderId: order.id,
          productName: product.name,
          price: totalAmount,
          duration: durationDays,
          startDate,
          endDate,
        })

        await sendEmail(user.email, emailTemplate)
      }

      console.log(`Order fulfilled for user ${userId}, product ${productId}`)
    } catch (error) {
      console.error("Error fulfilling order:", error)
    }
  }

  return NextResponse.json({ success: true, received: true })
}

export const config = {
  api: {
    bodyParser: false,
  },
}

