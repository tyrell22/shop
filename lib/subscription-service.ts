import { query } from "./db"

export type Subscription = {
  id: number
  user_id: number
  product_id: number
  start_date: Date
  end_date: Date
  status: string
  created_at: Date
  updated_at: Date
  product_name?: string
  product_price?: number
}

export async function createSubscription(
  userId: number,
  productId: number,
  startDate: Date,
  endDate: Date,
  status = "active",
): Promise<Subscription> {
  const result = await query(
    "INSERT INTO subscriptions (user_id, product_id, start_date, end_date, status) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [userId, productId, startDate, endDate, status],
  )

  return result.rows[0]
}

export async function getUserSubscriptions(userId: number): Promise<Subscription[]> {
  const result = await query(
    `SELECT s.*, p.name as product_name, p.price as product_price 
     FROM subscriptions s 
     JOIN products p ON s.product_id = p.id 
     WHERE s.user_id = $1 
     ORDER BY s.end_date DESC`,
    [userId],
  )

  return result.rows
}

export async function getActiveUserSubscriptions(userId: number): Promise<Subscription[]> {
  const result = await query(
    `SELECT s.*, p.name as product_name, p.price as product_price 
     FROM subscriptions s 
     JOIN products p ON s.product_id = p.id 
     WHERE s.user_id = $1 AND s.status = 'active' AND s.end_date > NOW() 
     ORDER BY s.end_date DESC`,
    [userId],
  )

  return result.rows
}

export async function getExpiredUserSubscriptions(userId: number): Promise<Subscription[]> {
  const result = await query(
    `SELECT s.*, p.name as product_name, p.price as product_price 
     FROM subscriptions s 
     JOIN products p ON s.product_id = p.id 
     WHERE s.user_id = $1 AND (s.status = 'expired' OR s.end_date <= NOW()) 
     ORDER BY s.end_date DESC`,
    [userId],
  )

  return result.rows
}

export async function getSubscriptionById(id: number): Promise<Subscription | null> {
  const result = await query(
    `SELECT s.*, p.name as product_name, p.price as product_price 
     FROM subscriptions s 
     JOIN products p ON s.product_id = p.id 
     WHERE s.id = $1`,
    [id],
  )

  if (result.rows.length === 0) {
    return null
  }

  return result.rows[0]
}

export async function updateSubscriptionStatus(id: number, status: string): Promise<boolean> {
  const result = await query("UPDATE subscriptions SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2", [
    status,
    id,
  ])

  return result.rowCount > 0
}

export async function renewSubscription(id: number, newEndDate: Date): Promise<Subscription | null> {
  const result = await query(
    "UPDATE subscriptions SET end_date = $1, status = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *",
    [newEndDate, "active", id],
  )

  if (result.rows.length === 0) {
    return null
  }
  export async function debugUserSubscriptions(userId: number): Promise<any> {
  const result = await query("SELECT * FROM subscriptions WHERE user_id = $1", [userId]);
  console.log("Raw subscriptions for user", userId, ":", result.rows);
  return result.rows;
}

  return result.rows[0]
}

