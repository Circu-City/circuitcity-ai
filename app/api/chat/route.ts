import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import prisma from "@/lib/db";

const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) 
  : null;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, sessionId, apiKey } = body;

    if (!message || !sessionId) {
      return NextResponse.json({ error: "Missing message or sessionId" }, { status: 400 });
    }

    // Find the store by API key
    let store = null;
    if (apiKey) {
      store = await prisma.store.findFirst({
        where: { apiKey },
        include: { embedSettings: true },
      });
    }

    if (!store) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
    }

    // Find or create conversation
    let conversation = await prisma.conversation.findUnique({
      where: { sessionId },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          sessionId,
          storeId: store.id,
          messages: [],
        },
      });
    }

    const messages = (conversation.messages as any[]) || [];

    // Add user message
    const userMessage = { role: "user", content: message, timestamp: new Date().toISOString() };
    messages.push(userMessage);

    // Call OpenAI (or fallback)
    let assistantReply = "Thanks for your message! I'm currently in demo mode. Ask me anything about our products.";

    if (openai) {
      try {
        const systemPrompt = store.embedSettings?.welcomeMessage 
          ? `You are a helpful customer support AI for ${store.name}. Be friendly, concise, and helpful.`
          : `You are a helpful AI assistant for ${store.name}.`;

        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            ...messages.slice(-10).map((m: any) => ({ 
              role: m.role as "user" | "assistant", 
              content: m.content 
            })),
          ],
          temperature: 0.7,
          max_tokens: 300,
        });

        assistantReply = completion.choices[0]?.message?.content || assistantReply;
      } catch (err) {
        console.error("OpenAI error:", err);
        assistantReply = "Sorry, I'm having trouble responding right now. Please try again later.";
      }
    }

    // Add assistant message
    const assistantMessage = { 
      role: "assistant", 
      content: assistantReply, 
      timestamp: new Date().toISOString() 
    };
    messages.push(assistantMessage);

    // Update conversation
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { 
        messages: messages as any,
        updatedAt: new Date(),
      },
    });

    // Update usage log (simple daily count)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await prisma.usageLog.upsert({
      where: {
        storeId_date: {
          storeId: store.id,
          date: today,
        },
      },
      update: {
        messagesCount: { increment: 1 },
      },
      create: {
        storeId: store.id,
        date: today,
        messagesCount: 1,
      },
    });

    return NextResponse.json({
      success: true,
      reply: assistantReply,
      conversationId: conversation.id,
    });

  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json({ 
      error: "Something went wrong", 
      reply: "Sorry, I couldn't process your message right now." 
    }, { status: 500 });
  }
}
