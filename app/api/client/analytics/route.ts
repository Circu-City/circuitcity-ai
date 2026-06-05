import { NextResponse } from "next/server";
import { getStoreAnalytics } from "@/lib/actions/client";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  try {
    await requireAuth();
    const data = await getStoreAnalytics();
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 401 });
  }
}