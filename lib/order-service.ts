import { query } from "./db"

export type Order = {
  id: number
  user_id: number
  total_amount: number
  status: string
  payment_method: string
  created_at: Date
  updated_at: Date
}

export type OrderItem = {
  id: number
  order_id: number
  product_id: number
  quantity: number
  price: number
  created_at: Date
  product_name?: string
}

export async function createOrder(
  userId: number,
  totalAmount: number,
  status: string,
  paymentMethod: string,
): Promise<Order> {
  const result = await query(
    "INSERT INTO orders (user_id, total_amount, status, payment_method) VALUES ($1, $2, $3, $4) RETURNING *",
    [userId, totalAmount, status, paymentMethod],
  )

  return result.rows[0]
}

export async function addOrderItem(
  orderId: number,
  productId: number,
  quantity: number,
  price: number,
): Promise<OrderItem> {
  const result = await query(
    "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4) RETURNING *",
    [orderId, productId, quantity, price],
  )

  return result.rows[0]
}

export async function getUserOrders(userId: number): Promise<Order[]> {
  const result = await query("SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC", [userId])

  return result.rows
}

export async function getOrderById(id: number): Promise<Order | null> {
  const result = await query("SELECT * FROM orders WHERE id = $1", [id])

  if (result.rows.length === 0) {
    return null
  }

  return result.rows[0]
}

export async function getOrderItems(orderId: number): Promise<OrderItem[]> {
  const result = await query(
    `SELECT oi.*, p.name as product_name 
     FROM order_items oi 
     JOIN products p ON oi.product_id = p.id 
     WHERE oi.order_id = $1`,
    [orderId],
  )

  return result.rows
}

export async function updateOrderStatus(id: number, status: string): Promise<boolean> {
  const result = await query("UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2", [
    status,
    id,
  ])

  return result.rowCount > 0
}

