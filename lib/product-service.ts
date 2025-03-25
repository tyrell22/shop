import { query } from "./db"

export type Product = {
  id: number
  name: string
  description: string
  price: number
  duration_days: number
  features: string[]
  created_at: Date
  updated_at: Date
  meta_title?: string
  meta_description?: string
  focus_keywords?: string[]
  seo_slug?: string
  canonical_url?: string
  og_image_url?: string
}

export async function createProduct(
  name: string,
  description: string,
  price: number,
  duration_days: number,
  features: string[],
  seoData?: {
    meta_title?: string
    meta_description?: string
    focus_keywords?: string[]
    seo_slug?: string
    canonical_url?: string
    og_image_url?: string
  },
): Promise<Product> {
  console.log("Creating product with data:", {
    name,
    description,
    price,
    duration_days,
    features,
    seoData,
  })

  try {
    // Ensure features is a valid array
    const featuresValue =
      Array.isArray(features) && features.length > 0 ? JSON.stringify(features) : JSON.stringify(["Basic Package"])

    // Prepare columns and values arrays
    const columns = ["name", "description", "price", "duration_days", "features"]
    const values = [name, description, price, duration_days, featuresValue]
    const placeholders = ["$1", "$2", "$3", "$4", "$5"]
    let paramIndex = 6

    // Add SEO fields if they exist
    if (seoData) {
      if (seoData.meta_title !== undefined) {
        columns.push("meta_title")
        values.push(seoData.meta_title)
        placeholders.push(`$${paramIndex++}`)
      }
      if (seoData.meta_description !== undefined) {
        columns.push("meta_description")
        values.push(seoData.meta_description)
        placeholders.push(`$${paramIndex++}`)
      }
      if (seoData.focus_keywords !== undefined) {
        columns.push("focus_keywords")
        values.push(JSON.stringify(seoData.focus_keywords))
        placeholders.push(`$${paramIndex++}`)
      }
      if (seoData.seo_slug !== undefined) {
        columns.push("seo_slug")
        values.push(seoData.seo_slug)
        placeholders.push(`$${paramIndex++}`)
      }
      if (seoData.canonical_url !== undefined) {
        columns.push("canonical_url")
        values.push(seoData.canonical_url)
        placeholders.push(`$${paramIndex++}`)
      }
      if (seoData.og_image_url !== undefined) {
        columns.push("og_image_url")
        values.push(seoData.og_image_url)
        placeholders.push(`$${paramIndex++}`)
      }
    }

    // Construct the SQL query
    const sql = `
      INSERT INTO products (${columns.join(", ")})
      VALUES (${placeholders.join(", ")})
      RETURNING *
    `

    const result = await query(sql, values)

    console.log("Product created in database:", result.rows[0])
    return processProduct(result.rows[0])
  } catch (error) {
    console.error("Error in createProduct:", error)
    throw error
  }
}

export async function getProducts(): Promise<Product[]> {
  const result = await query("SELECT * FROM products ORDER BY price ASC")
  return result.rows.map(processProduct)
}

export async function getProductById(id: number): Promise<Product | null> {
  const result = await query("SELECT * FROM products WHERE id = $1", [id])

  if (result.rows.length === 0) {
    return null
  }

  return processProduct(result.rows[0])
}

export async function updateProduct(
  id: number,
  data: {
    name?: string
    description?: string
    price?: number
    duration_days?: number
    features?: string[]
    meta_title?: string
    meta_description?: string
    focus_keywords?: string[]
    seo_slug?: string
    canonical_url?: string
    og_image_url?: string
  },
): Promise<Product | null> {
  // Get the current product
  const currentProduct = await getProductById(id)
  if (!currentProduct) {
    return null
  }

  // Build the update query dynamically
  const updates: string[] = []
  const values: any[] = []
  let paramIndex = 1

  // Add each field that needs to be updated
  if (data.name !== undefined) {
    updates.push(`name = $${paramIndex++}`)
    values.push(data.name)
  }
  if (data.description !== undefined) {
    updates.push(`description = $${paramIndex++}`)
    values.push(data.description)
  }
  if (data.price !== undefined) {
    updates.push(`price = $${paramIndex++}`)
    values.push(data.price)
  }
  if (data.duration_days !== undefined) {
    updates.push(`duration_days = $${paramIndex++}`)
    values.push(data.duration_days)
  }
  if (data.features !== undefined) {
    updates.push(`features = $${paramIndex++}`)
    values.push(JSON.stringify(data.features))
  }

  // Add SEO fields to update query
  if (data.meta_title !== undefined) {
    updates.push(`meta_title = $${paramIndex++}`)
    values.push(data.meta_title)
  }
  if (data.meta_description !== undefined) {
    updates.push(`meta_description = $${paramIndex++}`)
    values.push(data.meta_description)
  }
  if (data.focus_keywords !== undefined) {
    updates.push(`focus_keywords = $${paramIndex++}`)
    values.push(JSON.stringify(data.focus_keywords))
  }
  if (data.seo_slug !== undefined) {
    updates.push(`seo_slug = $${paramIndex++}`)
    values.push(data.seo_slug)
  }
  if (data.canonical_url !== undefined) {
    updates.push(`canonical_url = $${paramIndex++}`)
    values.push(data.canonical_url)
  }
  if (data.og_image_url !== undefined) {
    updates.push(`og_image_url = $${paramIndex++}`)
    values.push(data.og_image_url)
  }

  // Add updated_at timestamp
  updates.push(`updated_at = CURRENT_TIMESTAMP`)

  // Add the ID parameter
  values.push(id)

  // Execute the update query
  const result = await query(`UPDATE products SET ${updates.join(", ")} WHERE id = $${paramIndex} RETURNING *`, values)

  if (result.rows.length === 0) {
    return null
  }

  return processProduct(result.rows[0])
}

export async function deleteProduct(id: number): Promise<boolean> {
  const result = await query("DELETE FROM products WHERE id = $1", [id])
  return result.rowCount > 0
}

// Helper function to process product data
function processProduct(product: any): Product {
  // Process features
  let features = product.features
  if (typeof features === "string") {
    try {
      features = JSON.parse(features)
    } catch (e) {
      console.error("Error parsing features for product", product.id, e)
      features = []
    }
  } else if (!Array.isArray(features)) {
    features = []
  }

  // Process focus_keywords if it exists
  let focusKeywords = product.focus_keywords
  if (focusKeywords && typeof focusKeywords === "string") {
    try {
      focusKeywords = JSON.parse(focusKeywords)
    } catch (e) {
      console.error("Error parsing focus_keywords for product", product.id, e)
      focusKeywords = []
    }
  } else if (focusKeywords && !Array.isArray(focusKeywords)) {
    focusKeywords = []
  }

  return {
    ...product,
    // Ensure numeric types
    id: Number(product.id),
    price: typeof product.price === "string" ? Number.parseFloat(product.price) : Number(product.price),
    duration_days:
      typeof product.duration_days === "string"
        ? Number.parseInt(product.duration_days)
        : Number(product.duration_days),
    // Ensure array types
    features,
    focus_keywords: focusKeywords,
  }
}