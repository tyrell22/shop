import { type NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email-service";
import { requireAdmin } from "@/lib/auth-middleware";

export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    const authResult = await requireAdmin();
    
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: authResult.message },
        { status: authResult.status }
      );
    }

    // Get the request body
    const { to, subject, html, text } = await request.json();

    // Validate input
    if (!to || !subject || (!html && !text)) {
      return NextResponse.json(
        { success: false, message: "Recipient, subject, and content are required" },
        { status: 400 }
      );
    }

    // Send the email
    const result = await sendEmail(to, { subject, html, text });

    if (result.success) {
      return NextResponse.json({ success: true, message: "Email sent successfully" });
    } else {
      return NextResponse.json(
        { success: false, message: result.message || "Failed to send email" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send email", error: String(error) },
      { status: 500 }
    );
  }
}