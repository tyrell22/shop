import { query } from "./db"
import bcrypt from "bcryptjs"

export type User = {
  id: number
  name: string
  email: string
  created_at: Date
  updated_at: Date
}

export type UserWithPassword = User & {
  password_hash: string
}

export async function createUser(name: string, email: string, password: string): Promise<User> {
  // Hash the password
  const salt = await bcrypt.genSalt(10)
  const password_hash = await bcrypt.hash(password, salt)

  console.log(`Creating user with email: ${email}`)

  // Insert the user into the database
  const result = await query(
    "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, created_at, updated_at",
    [name, email, password_hash],
  )

  console.log(`User created with ID: ${result.rows[0].id}`)
  return result.rows[0]
}

export async function getUserByEmail(email: string): Promise<UserWithPassword | null> {
  console.log(`Looking up user by email: ${email}`)
  const result = await query("SELECT * FROM users WHERE email = $1", [email])

  if (result.rows.length === 0) {
    console.log(`No user found with email: ${email}`)
    return null
  }

  console.log(`Found user with ID: ${result.rows[0].id}`)
  return result.rows[0]
}

export async function getUserById(id: number): Promise<User | null> {
  console.log(`Looking up user by ID: ${id}`)
  const result = await query("SELECT id, name, email, created_at, updated_at FROM users WHERE id = $1", [id])

  if (result.rows.length === 0) {
    console.log(`No user found with ID: ${id}`)
    return null
  }

  console.log(`Found user: ${result.rows[0].name}`)
  return result.rows[0]
}

export async function verifyPassword(user: UserWithPassword, password: string): Promise<boolean> {
  console.log(`Verifying password for user: ${user.id}`)
  const result = await bcrypt.compare(password, user.password_hash)
  console.log(`Password verification result: ${result}`)
  return result
}

export async function updateUserProfile(id: number, name: string, email: string): Promise<User | null> {
  const result = await query(
    "UPDATE users SET name = $1, email = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING id, name, email, created_at, updated_at",
    [name, email, id],
  )

  if (result.rows.length === 0) {
    return null
  }

  return result.rows[0]
}

export async function changePassword(id: number, newPassword: string): Promise<boolean> {
  const salt = await bcrypt.genSalt(10)
  const password_hash = await bcrypt.hash(newPassword, salt)

  const result = await query("UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2", [
    password_hash,
    id,
  ])

  return result.rowCount > 0
}

