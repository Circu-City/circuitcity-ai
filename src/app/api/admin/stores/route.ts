import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();
    const stores = await prisma.store.findMany({
      include: { user: { select: { name: true, email: true } }, subscription: true, _count: { select: { conversations: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(stores.map(s => ({
      id: s.id, name: s.name, url: s.url, apiKey: s.apiKey, status: s.status,
      owner: s.user?.name || s.user?.email || "—",
      plan: s.subscription?.[0]?.plan || "free",
      conversations: s._count.conversations,
      createdAt: s.createdAt,
    })));
  } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
}
