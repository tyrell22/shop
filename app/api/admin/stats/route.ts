import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-middleware";

export async function GET() {
  try {
    // Check admin authentication
    const authResult = await requireAdmin();
    
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: authResult.message },
        { status: authResult.status }
      );
    }
    
    const stats = await query(`
      SELECT 
        (SELECT COUNT(*) FROM users) AS total_users,
        (SELECT COUNT(*) FROM subscriptions WHERE status = 'active' AND end_date > NOW()) AS active_subscriptions,
        (SELECT COALESCE(SUM(total_amount), 0) FROM orders) AS total_revenue,
        (SELECT COUNT(*) FROM products) AS total_products
    `);
    const recentOrders = await query(`
      SELECT o.id, o.total_amount, o.status, o.created_at, u.name AS user_name, u.email AS user_email
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
      LIMIT 5
    `);
    const activeSubscriptionsList = await query(`
      SELECT s.id, s.user_id, s.product_id, s.start_date, s.end_date, s.status, 
             u.name AS user_name, p.name AS product_name, s.m3u_url
      FROM subscriptions s
      JOIN users u ON s.user_id = u.id
      JOIN products p ON s.product_id = p.id
      WHERE s.status = 'active' AND s.end_date > NOW()
      ORDER BY s.start_date DESC
    `);

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers: Number(stats.rows[0].total_users),
        activeSubscriptions: Number(stats.rows[0].active_subscriptions),
        totalRevenue: Number(stats.rows[0].total_revenue), // Ensure number
        totalProducts: Number(stats.rows[0].total_products),
        recentOrders: recentOrders.rows.map((order) => ({
          ...order,
          total_amount: Number(order.total_amount), // Ensure number
        })),
        activeSubscriptionsList: activeSubscriptionsList.rows,
      },
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch stats" }, { status: 500 });
  }
}