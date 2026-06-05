import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const storeRecord = await prisma.store.findFirst({ where: { userId: session.userId } });
    const configRecord = storeRecord ? await prisma.embedConfig.findUnique({ where: { storeId: storeRecord.id } }) : null;

    return NextResponse.json({
      done: storeRecord?.status === "active",
      store: storeRecord ? { id: storeRecord.id, name: storeRecord.name, url: storeRecord.url, apiKey: storeRecord.apiKey } : null,
      config: configRecord ? { toneStyle: configRecord.toneStyle } : null,
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}