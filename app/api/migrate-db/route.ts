import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { verify } from "jsonwebtoken"
import { cookies } from "next/headers"
import { jwtConfig } from "@/lib/config"

export async function GET() {
  try {
    // Get the token from cookies
    const token = cookies().get(jwtConfig.cookieName)?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
    }

    // Verify the token
    const decoded = verify(token, jwtConfig.secret) as { 
      id: number; 
      email: string; 
      name: string;
      isAdmin?: boolean;
    };

    // Check if user is admin
    if (!decoded.isAdmin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }
    
    // Check if the SEO columns already exist
    const checkResult = await query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'products' AND column_name = 'meta_title'
    `)

    // If the column doesn't exist, add the SEO columns
    if (checkResult.rows.length === 0) {
      await query(`
        ALTER TABLE products 
        ADD COLUMN meta_title VARCHAR(255),
        ADD COLUMN meta_description TEXT,
        ADD COLUMN focus_keywords JSONB,
        ADD COLUMN seo_slug VARCHAR(255),
        ADD COLUMN canonical_url VARCHAR(255),
        ADD COLUMN og_image_url VARCHAR(255)
      `)

      return NextResponse.json({
        success: true,
        message: "Database migrated successfully. SEO columns added to products table.",
      })
    } else {
      return NextResponse.json({
        success: true,
        message: "SEO columns already exist in products table.",
      })
    }
  } catch (error) {
    console.error("Error migrating database:", error)
    return NextResponse.json(
      { success: false, message: "Failed to migrate database", error: String(error) },
      { status: 500 },
    )
  }
}