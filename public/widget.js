(function() {
  var d = document;
  var storeId = d.currentScript.getAttribute('data-store-id') || '';
  var apiUrl = d.currentScript.getAttribute('data-api') || 'https://chatbot.circucity.se';

  if (!storeId) { console.warn('CircuCity AI: data-store-id not set'); return; }

  var style = d.createElement('style');
  style.textContent = '.cc-ai-bubble{position:fixed;z-index:9999;width:60px;height:60px;border-radius:50%;background:linear-gradient(135deg,#9EF01A,#7bcb00);box-shadow:0 4px 14px rgba(158,240,26,0.35);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:transform 0.3s}.cc-ai-bubble:hover{transform:scale(1.1)}.cc-ai-bubble svg{width:28px;height:28px;color:#0A1428}.cc-ai-window{position:fixed;z-index:9999;width:380px;max-width:90vw;height:560px;max-height:80vh;border-radius:16px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.3);display:none;flex-direction:column;background:#fff}.cc-ai-window.open{display:flex}.cc-ai-header{background:linear-gradient(135deg,#9EF01A,#7bcb00);padding:16px;display:flex;align-items:center;justify-content:space-between}.cc-ai-header span{font-weight:700;color:#0A1428;font-size:16px}.cc-ai-header button{background:none;border:none;color:#0A1428;cursor:pointer;font-size:20px}.cc-ai-messages{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px}.cc-ai-message{max-width:85%;padding:10px 14px;border-radius:14px;font-size:14px;line-height:1.5}.cc-ai-message.user{align-self:flex-end;background:#f0f0f0;color:#333}.cc-ai-message.bot{align-self:flex-start;background:#0A1428;color:#fff;border-bottom-left-radius:4px}.cc-ai-input-wrap{display:flex;padding:12px;border-top:1px solid #eee;gap:8px}.cc-ai-input-wrap input{flex:1;border:1px solid #ddd;border-radius:10px;padding:10px 14px;font-size:14px;outline:none}.cc-ai-input-wrap input:focus{border-color:#9EF01A}.cc-ai-input-wrap button{background:linear-gradient(135deg,#9EF01A,#7bcb00);border:none;border-radius:10px;padding:10px 16px;color:#0A1428;font-weight:700;cursor:pointer}.cc-ai-br{bottom:20px;right:20px}.cc-ai-wr{bottom:90px;right:20px}';
  d.head.appendChild(style);

  var sessionId = 'cc_' + Math.random().toString(36).substr(2,9);

  function createBubble() {
    var b = d.createElement('div');
    b.className = 'cc-ai-bubble cc-ai-br';
    b.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>';
    b.onclick = function() { b.style.display='none';createWindow() };
    d.body.appendChild(b);
  }

  function createWindow() {
    var w = d.createElement('div');
    w.className = 'cc-ai-window cc-ai-wr open';
    w.innerHTML = '<div class="cc-ai-header"><span>AI Assistant</span><button id="cc-close">×</button></div><div class="cc-ai-messages" id="cc-msgs"><div class="cc-ai-message bot">Hi! How can I help you today?</div></div><div class="cc-ai-input-wrap"><input id="cc-input" type="text" placeholder="Type your message..."><button id="cc-send">Send</button></div>';
    d.body.appendChild(w);

    d.getElementById('cc-close').onclick = function() { w.remove(); createBubble() };
    var input = d.getElementById('cc-input');
    var msgs = d.getElementById('cc-msgs');

    function addMsg(text, role) {
      var m = d.createElement('div');
      m.className = 'cc-ai-message ' + role;
      m.textContent = text;
      msgs.appendChild(m);
      msgs.scrollTop = msgs.scrollHeight;
    }

    async function send() {
      var txt = input.value.trim();
      if (!txt) return;
      addMsg(txt, 'user');
      input.value = '';
      try {
        var r = await fetch(apiUrl + '/api/widget', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ store_id: storeId, message: txt, session_id: sessionId }) });
        var d = await r.json();
        addMsg(d.reply || 'Sorry, I could not process that.', 'bot');
      } catch(e) { addMsg('Connection error. Please try again.', 'bot') }
    }

    d.getElementById('cc-send').onclick = send;
    input.onkeydown = function(e) { if(e.key==='Enter') send() };
  }

  createBubble();
})();
