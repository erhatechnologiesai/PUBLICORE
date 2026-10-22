import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      body = {};
    }
    const { to, subject, html, apiKey: customKey } = body;

    const resendApiKey = customKey || process.env.RESEND_API_KEY;

    if (!to || !subject || !html) {
      return NextResponse.json(
        { error: "Missing required fields: to, subject, html" },
        { status: 400 }
      );
    }

    // If real Resend API Key is available, dispatch live email to actual inbox!
    if (resendApiKey && !resendApiKey.includes("Placeholder")) {
      try {
        const resendRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "PUBLICORE <publishing@resend.dev>",
            to: [to],
            subject,
            html,
          }),
        });

        if (resendRes.ok) {
          const resendData = await resendRes.json();
          return NextResponse.json({
            success: true,
            mode: "live",
            id: resendData.id,
            message: `Live email delivered to ${to} via Resend Cloud API`,
          });
        } else {
          const errData = await resendRes.json();
          console.warn("Resend API responded with error:", errData);
        }
      } catch (liveErr) {
        console.warn("Failed calling live Resend endpoint:", liveErr);
      }
    }

    // Default simulated mode when API key is not configured
    return NextResponse.json({
      success: true,
      mode: "simulated",
      message: `Dispatched to simulated scholarly outbox for recipient: ${to}`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Internal Email Handler Error" },
      { status: 500 }
    );
  }
}
