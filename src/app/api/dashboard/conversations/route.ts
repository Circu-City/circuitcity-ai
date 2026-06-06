import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const store = await prisma.store.findFirst({ where: { userId: session.userId } });
    if (!store) return NextResponse.json([]);

    const storeFilter = req.nextUrl.searchParams.get("store") || "";
    const where: any = { storeId: store.id };
    if (storeFilter) where.storeId = storeFilter;

    const conversations = await prisma.conversation.findMany({
      where, orderBy: { createdAt: "desc" }, take: 50,
      include: { store: { select: { name: true } } },
    });

    return NextResponse.json(conversations);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
