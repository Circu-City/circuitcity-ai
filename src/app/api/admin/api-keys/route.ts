import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

    await prisma.apiKey.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error("Admin api-keys delete error:", e.message);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
