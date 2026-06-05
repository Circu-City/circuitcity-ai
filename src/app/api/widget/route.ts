import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const { store_id, message, session_id } = await req.json();
        if (!store_id || !message) {
            return NextResponse.json({ error: "store_id and message required" }, { status: 400 });
        }

        const store = await prisma.store.findFirst({ where: { OR: [{ id: store_id }, { apiKey: store_id }] } });
        if (!store || store.status !== "active") {
            return NextResponse.json({ reply: "Store not found or inactive." });
        }

        // Try RAG service first
        try {
            const ragRes = await fetch("http://localhost:8000/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json", "x-api-key": process.env.RAG_API_KEY || "CircuCity-RAG-2024-1a2b3c4d5e6f7g8h9i10j" },
                body: JSON.stringify({ message, session_id: session_id || "widget" }),
            });
            if (ragRes.ok) {
                const data = await ragRes.json();
                await prisma.conversation.upsert({
                    where: { sessionId: session_id || "widget" },
                    update: { messages: [{ role: "user", content: message }, { role: "assistant", content: data.reply }] },
                    create: { storeId: store.id, sessionId: session_id || "widget", messages: [{ role: "user", content: message }, { role: "assistant", content: data.reply }] },
                });
                return NextResponse.json(data);
            }
        } catch {}

        // Fallback
        const reply = "Thanks for your message! Our team will get back to you shortly.";
        await prisma.conversation.create({
            data: { storeId: store.id, sessionId: session_id || "widget", messages: [{ role: "user", content: message }, { role: "assistant", content: reply }] },
        });
        return NextResponse.json({ reply });

    } catch (err) {
        return NextResponse.json({ reply: "Service temporarily unavailable." }, { status: 500 });
    }
}
