import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { getUserById } from "@/lib/user-service"
import { getProductById } from "@/lib/product-service"
import { sendEmail, generateSubscriptionExpirationEmail } from "@/lib/email-service"

// This endpoint should be called by a cron job service like Vercel Cron
export async function GET() {
  try {
    // Get subscriptions expiring in the next 7 days
    const result = await query(`
      SELECT s.id, s.user_id, s.product_id, s.end_date
      FROM subscriptions s
      WHERE s.status = 'active'
      AND s.end_date > NOW()
      AND s.end_date < NOW() + INTERVAL '7 days'
    `)

    const expiringSubscriptions = result.rows

    // Send reminder emails
    const emailResults = []
    for (const subscription of expiringSubscriptions) {
      try {
        const user = await getUserById(subscription.user_id)
        const product = await getProductById(subscription.product_id)

        if (user && product) {
          const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://your-iptv-site.com"
          const renewalLink = `${appUrl}/packages?renew=${product.id}`

          const emailTemplate = generateSubscriptionExpirationEmail(user.name, {
            subscriptionId: subscription.id,
            productName: product.name,
            endDate: subscription.end_date,
            renewalLink,
          })

          const emailResult = await sendEmail(user.email, emailTemplate)
          emailResults.push({
            subscriptionId: subscription.id,
            userId: user.id,
            success: emailResult.success,
            message: emailResult.message,
          })
        }
      } catch (error) {
        console.error(`Error processing subscription ${subscription.id}:`, error)
        emailResults.push({
          subscriptionId: subscription.id,
          userId: subscription.user_id,
          success: false,
          message: String(error),
        })
      }
    }

    return NextResponse.json({
      success: true,
      processed: expiringSubscriptions.length,
      results: emailResults,
    })
  } catch (error) {
    console.error("Error sending subscription reminders:", error)
    return NextResponse.json(
      { success: false, message: "Failed to send subscription reminders", error: String(error) },
      { status: 500 },
    )
  }
}

