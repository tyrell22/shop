import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { jwtConfig } from "@/lib/config"

export async function POST() {
  // Clear the auth cookie
  cookies().set({
    name: jwtConfig.cookieName,
    value: "",
    ...jwtConfig.cookieOptions,
    maxAge: 0,
  })

  return NextResponse.json({ success: true, message: "Logged out successfully" })
}