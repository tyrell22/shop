import { NextRequest, NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";

// Set SendGrid API key from environment variables
sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json();

    // Validate input
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ success: false, error: "All fields are required" }, { status: 400 });
    }

    // Define email content
    const msg = {
      to: "shop@crispiptv.com", // Your support email
      from: "shop@crispiptv.com", // Your verified SendGrid sender (update this)
      replyTo: email, // User’s email for replies
      subject: `Support Request: ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <h2>Support Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    };

    // Send the email via SendGrid
    await sgMail.send(msg);

    return NextResponse.json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 });
  }
}
