import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const stores = await prisma.store.findMany({
      include: { user: { select: { name: true, email: true } }, subscriptions: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(stores.map(s => ({
      id: s.id, name: s.name, url: s.url, apiKey: s.apiKey, status: s.status,
      owner: s.user?.name || s.user?.email || "—",
      plan: s.subscriptions?.[0]?.plan || "free", conversations: 0,
      createdAt: s.createdAt,
    })));
  } catch (e) { return NextResponse.json([], { status: 200 }); }
}

export async function DELETE(req: Request) {
  const session = await getSession();
  if (!session || session.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
  await prisma.store.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

export async function PUT(req: Request) {
  const session = await getSession();
  if (!session || session.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, status } = await req.json();
  if (!id || !status) return NextResponse.json({ error: "id and status required" }, { status: 400 });
  await prisma.store.update({ where: { id }, data: { status } });
  return NextResponse.json({ success: true });
}
