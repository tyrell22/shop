import { type NextRequest, NextResponse } from "next/server"
import {
  getUserSubscriptions,
  getActiveUserSubscriptions,
  getExpiredUserSubscriptions,
  debugUserSubscriptions,
} from "@/lib/subscription-service"
import { verify } from "jsonwebtoken"
import { cookies } from "next/headers"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

console.log("Fetching subscriptions for user ID:", decoded.id);
await debugUserSubscriptions(decoded.id);

export async function GET(request: NextRequest) {
  try {
    // Get the token from cookies
    const token = cookies().get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 })
    }

    // Verify the token
    const decoded = verify(token, JWT_SECRET) as { id: number; email: string; name: string }

    // Get the filter parameter
    const { searchParams } = new URL(request.url)
    const filter = searchParams.get("filter")

    let subscriptions

    if (filter === "active") {
      subscriptions = await getActiveUserSubscriptions(decoded.id)
    } else if (filter === "expired") {
      subscriptions = await getExpiredUserSubscriptions(decoded.id)
    } else {
      subscriptions = await getUserSubscriptions(decoded.id)
    }

    return NextResponse.json({ success: true, subscriptions })
  } catch (error) {
    console.error("Error fetching subscriptions:", error)
    return NextResponse.json(
      { success: false, message: "Failed to fetch subscriptions", error: String(error) },
      { status: 500 },
    )
  }
}

