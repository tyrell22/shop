import type { NextRequest } from "next/server"
import { verify } from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

// Function to get the authenticated user ID from the request
export async function getAuthUserId(req: NextRequest): Promise<number | null> {
  const token = req.cookies.get("auth_token")?.value

  if (!token) {
    return null
  }

  try {
    // Verify the token
    const decoded = verify(token, JWT_SECRET) as { id: number; email: string; name: string }
    return decoded.id || null
  } catch (error) {
    console.error("Error parsing auth token:", error)
    return null
  }
}

// Function to check if a user is authenticated
export async function isAuthenticated(req: NextRequest): Promise<boolean> {
  const userId = await getAuthUserId(req)
  return userId !== null
}

