import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const store = await prisma.store.findFirst({ where: { userId: session.userId } });
    if (!store) return NextResponse.json({ error: "Store not found" }, { status: 404 });

    let config = await prisma.embedConfig.findUnique({ where: { storeId: store.id } });

    return NextResponse.json({
      config: config || { widgetColor: "#9EF01A", position: "bottom-right", title: "AI Assistant", welcomeMsg: "Hi! How can I help you today?", toneStyle: "friendly" },
      apiKey: store.apiKey || "",
    });
  } catch (error) {
    console.error("Widget GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const store = await prisma.store.findFirst({ where: { userId: session.userId } });
    if (!store) return NextResponse.json({ error: "Store not found" }, { status: 404 });

    const { widgetColor, position, title, welcomeMsg, toneStyle } = await req.json();

    await prisma.embedConfig.upsert({
      where: { storeId: store.id },
      update: { widgetColor, position, title, welcomeMsg, toneStyle },
      create: { storeId: store.id, widgetColor, position, title, welcomeMsg, toneStyle },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Widget PUT error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}