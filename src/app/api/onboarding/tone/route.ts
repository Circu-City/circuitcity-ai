import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { toneStyle, toneDesc } = await request.json();
    const store = await prisma.store.findFirst({ where: { userId: session.userId } });
    if (!store) return NextResponse.json({ error: "Store not found" }, { status: 404 });

    await prisma.embedConfig.upsert({
      where: { storeId: store.id },
      update: { toneStyle: toneStyle || "friendly" },
      create: { storeId: store.id, toneStyle: toneStyle || "friendly" },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save tone" }, { status: 500 });
  }
}