import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { name, url, industry, platform } = await request.json();

    const store = await prisma.store.create({
      data: { userId: session.userId, name, url: url || null, industry: industry || null, status: "active" },
    });

    await prisma.embedConfig.create({
      data: { storeId: store.id },
    });

    return NextResponse.json({ storeId: store.id, apiKey: store.apiKey });
  } catch (error) {
    console.error("Store create error:", error);
    return NextResponse.json({ error: "Failed to create store" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { name, url, industry } = await request.json();

    const existingStore = await prisma.store.findFirst({ where: { userId: session.userId } });
    if (!existingStore) return NextResponse.json({ error: "Store not found" }, { status: 404 });

    const store = await prisma.store.update({
      where: { id: existingStore.id },
      data: { name, url: url || null, industry: industry || null },
    });

    return NextResponse.json({ storeId: store.id, apiKey: store.apiKey });
  } catch {
    return NextResponse.json({ error: "Failed to update store" }, { status: 500 });
  }
}
