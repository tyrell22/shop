import { type NextRequest, NextResponse } from "next/server"
import { createUser, getUserByEmail } from "@/lib/user-service"
import { sendEmail, generateWelcomeEmail } from "@/lib/email-service"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ success: false, message: "Name, email, and password are required" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      return NextResponse.json({ success: false, message: "User with this email already exists" }, { status: 409 })
    }

    // Create the user
    const user = await createUser(name, email, password)

    // Send welcome email
    try {
      const emailTemplate = generateWelcomeEmail(name)
      await sendEmail(email, emailTemplate)
    } catch (emailError) {
      console.error("Error sending welcome email:", emailError)
      // Continue with registration even if email fails
    }

    // Return the user without password
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { success: false, message: "Failed to register user", error: String(error) },
      { status: 500 },
    )
  }
}

