import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { verify } from "jsonwebtoken"
import { cookies } from "next/headers"
import { isAdmin } from "@/lib/admin-utils"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function GET() {
  try {
    // Get the token from cookies
    const token = cookies().get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 })
    }

    // Verify the token
    const decoded = verify(token, JWT_SECRET) as { id: number; email: string; name: string }

    // Check if user is admin
    const admin = await isAdmin(decoded.id)

    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 })
    }

    // Get total users count
    const usersResult = await query("SELECT COUNT(*) as count FROM users")
    const totalUsers = Number.parseInt(usersResult.rows[0].count)

    // Get active subscriptions count
    const subscriptionsResult = await query(
      "SELECT COUNT(*) as count FROM subscriptions WHERE status = 'active' AND end_date > NOW()",
    )
    const activeSubscriptions = Number.parseInt(subscriptionsResult.rows[0].count)

    // Get total revenue
    const revenueResult = await query("SELECT SUM(total_amount) as total FROM orders WHERE status = 'completed'")
    const totalRevenue = revenueResult.rows[0].total ? Number.parseFloat(revenueResult.rows[0].total) : 0

    // Get products count
    const productsResult = await query("SELECT COUNT(*) as count FROM products")
    const totalProducts = Number.parseInt(productsResult.rows[0].count)

    // Get recent orders
    const recentOrdersResult = await query(`
      SELECT o.id, o.total_amount, o.status, o.created_at, u.name as user_name, u.email as user_email
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
      LIMIT 5
    `)

    const recentOrders = recentOrdersResult.rows.map((order) => ({
      id: order.id,
      total_amount: Number.parseFloat(order.total_amount),
      status: order.status,
      created_at: order.created_at,
      user_name: order.user_name,
      user_email: order.user_email,
    }))

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        activeSubscriptions,
        totalRevenue,
        totalProducts,
        recentOrders,
      },
    })
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return NextResponse.json(
      { success: false, message: "Failed to fetch admin stats", error: String(error) },
      { status: 500 },
    )
  }
}

