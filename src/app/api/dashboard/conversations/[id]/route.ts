import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const store = await prisma.store.findFirst({ where: { userId: session.userId } });
  const conv = await prisma.conversation.findUnique({ where: { id, storeId: store?.id || "" } });
  if (!conv) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({
    id: conv.id, messages: conv.messages, status: conv.status,
    escalated: conv.escalated, createdAt: conv.createdAt,
    customerName: conv.customerName, email: conv.email,
  });
}
