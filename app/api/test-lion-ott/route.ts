import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    const lionOttResponse = await fetch("https://bqpanel.com/create-subscription", {
      method: "POST",
      headers: {
        "API-Key": process.env.LION_OTT_API_KEY, // Ensure this is set in Vercel
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36", // Mimic browser to avoid Cloudflare
        "Accept": "application/json",
      },
      body: JSON.stringify({
        type: 1, // M3U subscription
        package: 123, // Test ID, adjust based on panel or support
        country: "ALL",
        username, // Optional, if API allows setting
        password, // Optional, if API allows setting
      }),
    });

    const lionOttData = await lionOttResponse.text();
    console.log("Lion OTT raw response:", lionOttData);

    let jsonData;
    try {
      jsonData = JSON.parse(lionOttData);
    } catch (e) {
      return NextResponse.json({ success: false, message: "Invalid JSON response", raw: lionOttData }, { status: 500 });
    }

    if (!lionOttResponse.ok || !jsonData.success) {
      return NextResponse.json({ success: false, message: "Failed to create user", data: jsonData }, { status: lionOttResponse.status });
    }

    return NextResponse.json({ success: true, data: jsonData });
  } catch (error) {
    console.error("Error testing Lion OTT API:", error);
    return NextResponse.json({ success: false, message: "Internal server error", error: error.message }, { status: 500 });
  }
}
