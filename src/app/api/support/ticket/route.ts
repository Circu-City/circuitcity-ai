import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { subject, message } = await req.json();
    if (!subject || !message) return NextResponse.json({ error: "Subject and message required" }, { status: 400 });

    const supportTicket = await prisma.supportTicket.create({
      data: {
        userId: session.userId,
        subject,
        message,
        status: "open",
      },
    });

    return NextResponse.json({ success: true, ticket: supportTicket });
  } catch (error) {
    console.error("Support ticket error:", error);
    return NextResponse.json({ error: "Failed to submit ticket" }, { status: 500 });
  }
}