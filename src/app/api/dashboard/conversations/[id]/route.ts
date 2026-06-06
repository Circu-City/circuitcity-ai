import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const store = await prisma.store.findFirst({ where: { userId: session.userId } });
    if (!store) return NextResponse.json({ error: "Store not found" }, { status: 404 });

    const conversation = await prisma.conversation.findUnique({
      where: { id: params.id, storeId: store.id },
    });

    if (!conversation) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({
      ...conversation,
      messages: Array.isArray(conversation.messages) ? conversation.messages : [],
    });
  } catch (e: any) {
    console.error("Conversation detail error:", e.message);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
