import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { logAdminAction } from "@/lib/actions/admin";

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();

    // In a real app this would save to a PlatformSetting table.
    // For now we just log the change as an admin action.
    await logAdminAction("update_platform_settings", "Platform", "", body);

    return NextResponse.json({ success: true, message: "Settings saved (logged as admin action)" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
