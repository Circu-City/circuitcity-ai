import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const apiKey = searchParams.get("apiKey") || "";

  const widgetScript = `
(function() {
  const API_BASE = window.location.origin;
  const API_KEY = "${apiKey || 'YOUR_API_KEY'}";

  let isOpen = false;
  let sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  let messages = [];

  // Create styles
  const style = document.createElement('style');
  style.textContent = \`
    #cc-ai-widget { position: fixed; bottom: 20px; right: 20px; z-index: 999999; font-family: system-ui, -apple-system, sans-serif; }
    #cc-ai-bubble { width: 56px; height: 56px; background: #9EF01A; border-radius: 9999px; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 4px 20px rgba(158, 240, 26, 0.4); transition: transform 0.2s; }
    #cc-ai-bubble:hover { transform: scale(1.05); }
    #cc-ai-bubble svg { width: 26px; height: 26px; color: #0A1428; }
    #cc-ai-window { position: fixed; bottom: 90px; right: 20px; width: 360px; height: 520px; background: white; border-radius: 16px; box-shadow: 0 10px 40px rgba(0,0,0,0.15); display: none; flex-direction: column; overflow: hidden; z-index: 999999; }
    #cc-ai-window.open { display: flex; }
    #cc-ai-header { background: #0A1428; color: white; padding: 14px 16px; display: flex; align-items: center; justify-content: space-between; }
    #cc-ai-header .title { font-weight: 600; display: flex; align-items: center; gap: 8px; }
    #cc-ai-messages { flex: 1; padding: 16px; overflow-y: auto; background: #f8f9fa; }
    .cc-msg { max-width: 80%; padding: 10px 14px; border-radius: 14px; margin-bottom: 8px; font-size: 14px; line-height: 1.4; }
    .cc-msg.user { background: #9EF01A; color: #0A1428; margin-left: auto; border-bottom-right-radius: 4px; }
    .cc-msg.bot { background: white; border: 1px solid #e5e7eb; margin-right: auto; border-bottom-left-radius: 4px; }
    #cc-ai-input-area { border-top: 1px solid #e5e7eb; padding: 12px; background: white; display: flex; gap: 8px; }
    #cc-ai-input { flex: 1; border: 1px solid #d1d5db; border-radius: 9999px; padding: 10px 16px; font-size: 14px; outline: none; }
    #cc-ai-send { background: #9EF01A; border: none; width: 40px; height: 40px; border-radius: 9999px; display: flex; align-items: center; justify-content: center; cursor: pointer; }
  \`;
  document.head.appendChild(style);

  // Create bubble
  const bubble = document.createElement('div');
  bubble.id = 'cc-ai-widget';
  bubble.innerHTML = \`
    <div id="cc-ai-bubble">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    </div>
    <div id="cc-ai-window">
      <div id="cc-ai-header">
        <div class="title">
          <span>AI Assistant</span>
        </div>
        <button id="cc-ai-close" style="background:none;border:none;color:#9ca3af;font-size:18px;cursor:pointer;">×</button>
      </div>
      <div id="cc-ai-messages"></div>
      <div id="cc-ai-input-area">
        <input id="cc-ai-input" type="text" placeholder="Type your message..." />
        <button id="cc-ai-send">
          <svg width="18" height="18" fill="none" stroke="#0A1428" stroke-width="3" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      </div>
    </div>
  \`;
  document.body.appendChild(bubble);

  const windowEl = document.getElementById('cc-ai-window');
  const messagesEl = document.getElementById('cc-ai-messages');
  const input = document.getElementById('cc-ai-input');
  const sendBtn = document.getElementById('cc-ai-send');
  const closeBtn = document.getElementById('cc-ai-close');

  // Toggle chat
  bubble.querySelector('#cc-ai-bubble').addEventListener('click', () => {
    isOpen = !isOpen;
    windowEl.classList.toggle('open', isOpen);
    if (isOpen && messages.length === 0) {
      addMessage("bot", "Hi! How can I help you today?");
    }
  });

  closeBtn.addEventListener('click', () => {
    isOpen = false;
    windowEl.classList.remove('open');
  });

  function addMessage(role, content) {
    const div = document.createElement('div');
    div.className = 'cc-msg ' + (role === 'user' ? 'user' : 'bot');
    div.textContent = content;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    messages.push({ role, content });
  }

  async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    addMessage('user', text);
    input.value = '';

    // Show typing indicator
    const typing = document.createElement('div');
    typing.className = 'cc-msg bot';
    typing.textContent = 'Typing...';
    messagesEl.appendChild(typing);
    messagesEl.scrollTop = messagesEl.scrollHeight;

    try {
      const res = await fetch(API_BASE + '/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          sessionId: sessionId,
          apiKey: API_KEY
        })
      });

      const data = await res.json();
      typing.remove();

      if (data.reply) {
        addMessage('bot', data.reply);
      } else {
        addMessage('bot', "Sorry, something went wrong.");
      }
    } catch (err) {
      typing.remove();
      addMessage('bot', "I'm having trouble connecting. Please try again.");
    }
  }

  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });

  // Optional: Auto-open after 8 seconds on first visit (can be removed)
  // setTimeout(() => { if (!isOpen) { isOpen = true; windowEl.classList.add('open'); } }, 8000);
})();
`;

  return new NextResponse(widgetScript, {
    headers: {
      "Content-Type": "application/javascript",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
