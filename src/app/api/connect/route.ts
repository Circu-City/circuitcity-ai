import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: NextRequest) {
    try {
        const { api_key, store_url, store_name, platform } = await req.json();
        if (!api_key || !store_url) {
            return NextResponse.json({ error: "api_key and store_url required" }, { status: 400 });
        }

        const store = await prisma.store.findUnique({ where: { apiKey: api_key } });
        if (!store) {
            return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
        }

        await prisma.store.update({
            where: { id: store.id },
            data: { url: store_url, name: store_name || store.name, status: "active" },
        });

        await prisma.embedConfig.upsert({
            where: { storeId: store.id },
            create: { storeId: store.id },
            update: {},
        });

        const embedCode = `<script src="https://chatbot.circucity.se/widget.js" data-store-id="${api_key}" async></script>`;
        await prisma.store.update({ where: { id: store.id }, data: { embedCode } });

        return NextResponse.json({ success: true, embedCode });
    } catch (err) {
        return NextResponse.json({ error: "Connection failed" }, { status: 500 });
    }
}
