import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { twoFactorEnabled: true, twoFactorSecret: true },
    });

    return NextResponse.json({ enabled: user?.twoFactorEnabled ?? false });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { action, code } = await req.json();

    if (action === "enable") {
      // In a real app, generate TOTP secret & QR code here
      // For now, enable directly with a placeholder (require actual 2FA code in production)
      if (!code) {
        return NextResponse.json({ 
          error: "2FA setup requires verification code",
          setup: true,
          message: "In production, scanning a QR code with Google Authenticator would happen here.",
          placeholder: true,
        }, { status: 400 });
      }

      await prisma.user.update({
        where: { id: session.userId },
        data: { twoFactorEnabled: true, twoFactorSecret: "enabled_" + Date.now() },
      });

      return NextResponse.json({ success: true, message: "2FA has been enabled!" });
    }

    if (action === "disable") {
      if (!code) return NextResponse.json({ error: "Verification code required" }, { status: 400 });
      await prisma.user.update({
        where: { id: session.userId },
        data: { twoFactorEnabled: false, twoFactorSecret: null },
      });
      return NextResponse.json({ success: true, message: "2FA has been disabled." });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("2FA error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}