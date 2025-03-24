import { type NextRequest, NextResponse } from "next/server"
import { verify } from "jsonwebtoken"
import { cookies } from "next/headers"
import { isAdmin } from "@/lib/admin-utils"
import { sendEmail } from "@/lib/email-service"
import { jwtConfig } from "@/lib/config"

export async function POST(request: NextRequest) {
  try {
    // Get the token from cookies
    const token = cookies().get(jwtConfig.cookieName)?.value

    if (!token) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 })
    }

    // Verify the token
    const decoded = verify(token, jwtConfig.secret) as { id: number; email: string; name: string }

    // Check if user is admin
    const admin = await isAdmin(decoded.id)

    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 })
    }

    // Get the request body
    const { to, subject, html, text } = await request.json()

    // Validate input
    if (!to || !subject || (!html && !text)) {
      return NextResponse.json(
        { success: false, message: "Recipient, subject, and content are required" },
        { status: 400 },
      )
    }

    // Send the email
    const result = await sendEmail(to, { subject, html, text })

    if (result.success) {
      return NextResponse.json({ success: true, message: "Email sent successfully" })
    } else {
      return NextResponse.json({ success: false, message: result.message || "Failed to send email" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error sending email:", error)
    return NextResponse.json({ success: false, message: "Failed to send email", error: String(error) }, { status: 500 })
  }
}