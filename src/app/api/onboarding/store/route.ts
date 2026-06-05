import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { name, url, industry } = await request.json();
    
    // Find the store by userId first
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
