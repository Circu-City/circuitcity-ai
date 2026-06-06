import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { name, phone, address, storeName, storeUrl } = await req.json();

    if (name) {
      await prisma.user.update({ where: { id: session.userId }, data: { name } });
    }

    const store = await prisma.store.findFirst({ where: { userId: session.userId } });
    if (store && (storeName || storeUrl || phone || address)) {
      await prisma.store.update({
        where: { id: store.id },
        data: {
          name: storeName || undefined,
          url: storeUrl || undefined,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Profile error:", error);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
