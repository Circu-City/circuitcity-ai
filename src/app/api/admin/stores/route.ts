import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const stores = await prisma.store.findMany({
      include: { user: { select: { name: true, email: true } }, subscription: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(stores.map(s => ({
      id: s.id, name: s.name, url: s.url, apiKey: s.apiKey, status: s.status,
      owner: s.user?.name || s.user?.email || "—",
      plan: s.subscription?.[0]?.plan || "free", conversations: 0,
      createdAt: s.createdAt,
    })));
  } catch (e) { return NextResponse.json([], { status: 200 }); }
}
