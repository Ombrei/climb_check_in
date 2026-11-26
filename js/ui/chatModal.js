// Context-aware Gemini AI Climbing Coach chat modal
import { GOUT_CONFIG, PLAN_META } from '../data/plans.js';
import {
  buildCoachSystemPrompt,
  loadGeminiConfig,
  sendCoachMessage
} from '../core/gemini.js';

const QUICK_PROMPTS = [
  'How should I modify today’s plan?',
  'Should I climb, lift, or rest today?',
  'Give me a gout-safe warm-up & exercise swap',
  'What bodybuilding program fits me today?'
];

// Safe inline formatting (**bold** and `code`) using DOM nodes (no innerHTML injection)
function appendFormattedInline(container, text) {
  const tokenRegex = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let lastIndex = 0;
  let match;

  while ((match = tokenRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      container.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
    }
    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      const strong = document.createElement('strong');
      strong.className = 'font-semibold text-ink';
      strong.textContent = token.slice(2, -2);
      container.appendChild(strong);
    } else if (token.startsWith('`') && token.endsWith('`')) {
      const code = document.createElement('code');
      code.className = 'font-mono text-[11px] px-1 py-0.5 rounded bg-zinc-800 text-zinc-200';
      code.textContent = token.slice(1, -1);
      container.appendChild(code);
    }
    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) {
    container.appendChild(document.createTextNode(text.slice(lastIndex)));
  }
}

// Render concise markdown-ish coach replies cleanly and safely
function renderSafeMessageContent(text) {
  const wrapper = document.createElement('div');
  wrapper.className = 'space-y-1.5';

  const lines = text.split(/\r?\n/);
  let currentList = null;

  lines.forEach((rawLine) => {
    const line = rawLine.trim();
    if (!line) {
      currentList = null;
      return;
    }

    const bulletMatch = line.match(/^[-*•]\s+(.*)$/);
    const numMatch = line.match(/^\d+[.)]\s+(.*)$/);

    if (bulletMatch || numMatch) {
      if (!currentList) {
        currentList = document.createElement('ul');
        currentList.className = 'space-y-1 pl-1';
        wrapper.appendChild(currentList);
      }
      const li = document.createElement('li');
      li.className = 'flex items-start gap-1.5';

      const marker = document.createElement('span');
      marker.className = 'text-zinc-500 select-none shrink-0';
      marker.textContent = '•';

      const body = document.createElement('span');
      appendFormattedInline(body, (bulletMatch ? bulletMatch[1] : numMatch[1]).trim());

      li.appendChild(marker);
      li.appendChild(body);
      currentList.appendChild(li);
      return;
    }

    currentList = null;
    const p = document.createElement('p');
    appendFormattedInline(p, line);
    wrapper.appendChild(p);
  });

  return wrapper;
}

export function createChatModal({ els, appState, getActiveContext, onOpenAiSettings }) {
  let messages = []; // { role: 'user' | 'assistant' | 'error', text: string }
  let isSending = false;

  function updateHeaderStatusDot() {
    const hasKey = Boolean(loadGeminiConfig().apiKey);
    if (els.chatKeyStatusDot) {
      els.chatKeyStatusDot.className = hasKey
        ? 'w-1.5 h-1.5 rounded-full bg-emerald-400 absolute top-1.5 right-1.5'
        : 'hidden';
    }
  }

  function renderContextSummary() {
    const ctx = getActiveContext();
    const gCfg = GOUT_CONFIG[ctx.record.gout] || GOUT_CONFIG.green;
    const planLabel = ctx.record.lowEnergy
      ? '5-Min Floor'
      : PLAN_META[ctx.effectivePlan]
        ? PLAN_META[ctx.effectivePlan].short
        : 'Plan';
    const waterL = (ctx.record.waterMl / 1000).toFixed(1);

    els.chatContextPill.textContent = `${gCfg.label} Toe · ${planLabel} · ${waterL}L`;
  }

  function renderQuickPrompts() {
    els.chatQuickPrompts.innerHTML = '';
    const hasKey = Boolean(loadGeminiConfig().apiKey);
    const shouldShow = hasKey && messages.length === 0 && !isSending;
    els.chatQuickPrompts.classList.toggle('hidden', !shouldShow);

    if (!shouldShow) return;

    QUICK_PROMPTS.forEach((promptText) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = promptText;
      btn.className =
        'text-left px-2.5 py-2 rounded-lg bg-bg border border-border text-[11px] text-muted hover:text-ink hover:border-zinc-600 active:scale-[0.99] transition';
      btn.addEventListener('click', () => handleSend(promptText));
      els.chatQuickPrompts.appendChild(btn);
    });
  }

  function renderMessages() {
    const config = loadGeminiConfig();
    const hasKey = Boolean(config.apiKey);

    els.chatSetupBanner.classList.toggle('hidden', hasKey);
    els.chatClearBtn.classList.toggle('hidden', messages.length === 0);
    els.chatInput.disabled = !hasKey || isSending;
    els.chatSendBtn.disabled = !hasKey || isSending;

    els.chatMessages.innerHTML = '';

    if (hasKey && messages.length === 0 && !isSending) {
      const welcome = document.createElement('div');
      welcome.className = 'rounded-xl bg-bg border border-border p-3 text-xs text-muted leading-relaxed';
      welcome.textContent =
        'Ask anything about today’s workout, gout-safe swaps, finger recovery, or bodybuilding gym options. I already see today’s check-in context.';
      els.chatMessages.appendChild(welcome);
    }

    messages.forEach((msg) => {
      const row = document.createElement('div');
      row.className = msg.role === 'user' ? 'flex justify-end' : 'flex justify-start';

      const bubble = document.createElement('div');
      if (msg.role === 'user') {
        bubble.className =
          'max-w-[85%] rounded-2xl rounded-br-sm bg-zinc-800 border border-zinc-700 px-3 py-2 text-xs text-ink leading-relaxed';
        bubble.textContent = msg.text;
      } else if (msg.role === 'error') {
        bubble.className =
          'max-w-[92%] rounded-xl bg-rose-500/10 border border-rose-500/30 px-3 py-2 text-xs text-rose-300 leading-relaxed';
        bubble.textContent = msg.text;
      } else {
        bubble.className =
          'max-w-[92%] rounded-2xl rounded-bl-sm bg-bg border border-border px-3 py-2.5 text-xs text-zinc-200 leading-relaxed';
        bubble.appendChild(renderSafeMessageContent(msg.text));
      }

      row.appendChild(bubble);
      els.chatMessages.appendChild(row);
    });

    if (isSending) {
      const typingRow = document.createElement('div');
      typingRow.className = 'flex justify-start';
      const typingBubble = document.createElement('div');
      typingBubble.className =
        'rounded-2xl rounded-bl-sm bg-bg border border-border px-3 py-2 text-xs text-muted font-mono animate-pulse';
      typingBubble.textContent = 'Coach is thinking...';
      typingRow.appendChild(typingBubble);
      els.chatMessages.appendChild(typingRow);
    }

    renderQuickPrompts();

    // Auto-scroll to newest message
    els.chatMessages.scrollTop = els.chatMessages.scrollHeight;
  }

  async function handleSend(rawText) {
    const text = (rawText !== undefined ? rawText : els.chatInput.value).trim();
    if (!text || isSending) return;

    const config = loadGeminiConfig();
    if (!config.apiKey) {
      renderMessages();
      return;
    }

    els.chatInput.value = '';
    messages.push({ role: 'user', text });
    isSending = true;
    renderMessages();

    try {
      const ctx = getActiveContext();
      const systemPrompt = buildCoachSystemPrompt(appState, ctx);
      const historyForApi = messages.filter((m) => m.role === 'user' || m.role === 'assistant');

      const reply = await sendCoachMessage({
        apiKey: config.apiKey,
        model: config.model,
        systemPrompt,
        history: historyForApi
      });

      messages.push({ role: 'assistant', text: reply });
    } catch (err) {
      messages.push({
        role: 'error',
        text: err && err.message ? err.message : 'Something went wrong reaching Gemini.'
      });
    } finally {
      isSending = false;
      renderMessages();
    }
  }

  function open() {
    renderContextSummary();
    renderMessages();
    updateHeaderStatusDot();
    els.chatModal.classList.remove('hidden');
    els.chatModal.classList.add('flex');
    if (loadGeminiConfig().apiKey && els.chatInput) {
      setTimeout(() => els.chatInput.focus(), 50);
    }
  }

  function close() {
    els.chatModal.classList.add('hidden');
    els.chatModal.classList.remove('flex');
  }

  function syncConfigState() {
    updateHeaderStatusDot();
    if (!els.chatModal.classList.contains('hidden')) {
      renderContextSummary();
      renderMessages();
    }
  }

  function bindEvents() {
    els.openChatBtn.addEventListener('click', open);
    els.closeChatBtn.addEventListener('click', close);

    els.chatModal.addEventListener('click', (e) => {
      if (e.target === els.chatModal) close();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !els.chatModal.classList.contains('hidden')) {
        close();
      }
    });

    els.chatClearBtn.addEventListener('click', () => {
      messages = [];
      renderMessages();
    });

    const openSettingsFromChat = () => {
      close();
      if (typeof onOpenAiSettings === 'function') onOpenAiSettings();
    };

    els.chatSettingsBtn.addEventListener('click', openSettingsFromChat);
    els.chatSetupKeyBtn.addEventListener('click', openSettingsFromChat);

    els.chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleSend();
    });
  }

  bindEvents();
  updateHeaderStatusDot();

  return { open, close, syncConfigState };
}
