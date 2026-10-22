import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
    }

    const {
      name,
      email,
      institution,
      category,
      priority = "Normal",
      manuscriptId,
      subject,
      message,
      fileName,
    } = body;

    // Strict Validations
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Please provide a valid full name (minimum 2 characters)." },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !email.includes("@") || !email.includes(".")) {
      return NextResponse.json(
        { error: "Please provide a valid scholarly/institutional email address." },
        { status: 400 }
      );
    }

    if (!subject || typeof subject !== "string" || subject.trim().length < 4) {
      return NextResponse.json(
        { error: "Subject line must be at least 4 characters." },
        { status: 400 }
      );
    }

    if (!message || typeof message !== "string" || message.trim().length < 15) {
      return NextResponse.json(
        { error: "Inquiry message must be at least 15 characters long." },
        { status: 400 }
      );
    }

    // Generate unique inquiry ticket ID
    const randomHex = Math.floor(1000 + Math.random() * 9000).toString();
    const ticketId = `TKT-PUB-${randomHex}`;
    const timestamp = new Date().toISOString();

    // Map department SLA
    let estimatedHours = 24;
    if (priority === "Urgent") estimatedHours = 4;
    else if (priority === "High") estimatedHours = 12;

    const responsePayload = {
      success: true,
      ticketId,
      timestamp,
      name: name.trim(),
      email: email.trim(),
      institution: (institution || "Independent Scholar").trim(),
      category: category || "General Editorial Inquiry",
      priority,
      manuscriptId: manuscriptId ? manuscriptId.trim() : null,
      subject: subject.trim(),
      fileName: fileName || null,
      slaHours: estimatedHours,
      estimatedResponseTime: `within ${estimatedHours} business hours`,
      status: "Logged in Secretariat Registry",
      message: "Your inquiry has been successfully transmitted to the PUBLICORE Editorial Secretariat.",
    };

    return NextResponse.json(responsePayload, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to process scholarly contact inquiry" },
      { status: 500 }
    );
  }
}
