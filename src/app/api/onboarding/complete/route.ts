import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const storeRecord = await prisma.store.findFirst({ where: { userId: session.userId } });
    if (!storeRecord) return NextResponse.json({ error: "Store not found" }, { status: 404 });

    await prisma.store.update({
      where: { id: storeRecord.id },
      data: { status: "active" },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to complete onboarding" }, { status: 500 });
  }
}