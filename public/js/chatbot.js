/**
 * MargDarshak AI - Interactive Counselor Chatbot Module
 * Supports Multilingual Chat (English, Hindi, Marathi), Speech-to-Text (Voice Mic), and SpeechSynthesis
 */

let chatHistory = [];
let isRecognitionActive = false;

const initChatbot = () => {
  renderChatbotUI();
};

const renderChatbotUI = () => {
  // Check if widget already exists
  if (document.getElementById('margdarshakChatWidget')) return;

  const chatDiv = document.createElement('div');
  chatDiv.id = 'margdarshakChatWidget';
  chatDiv.innerHTML = `
    <!-- Floating Circular Trigger Button -->
    <div id="chatTriggerBtn" class="chat-trigger-btn shadow-lg" onclick="toggleChatWindow()">
      <div class="position-relative">
        <i class="fa-solid fa-comments fa-xl text-white"></i>
        <span class="position-absolute top-0 start-100 translate-middle p-1 bg-success border border-light rounded-circle"></span>
      </div>
      <span class="d-none d-md-inline ms-2 fw-bold text-white small">Ask Counselor AI</span>
    </div>

    <!-- Chat Window Container -->
    <div id="chatWindow" class="chat-window shadow-2xl d-none">
      <!-- Header -->
      <div class="chat-header p-3 d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-center">
          <div class="bg-primary text-white p-2 rounded-circle me-2 d-flex align-items-center justify-content-center" style="width: 34px; height: 34px;">
            <i class="fa-solid fa-robot"></i>
          </div>
          <div>
            <div class="fw-bold text-white small mb-0">MargDarshak AI Counselor</div>
            <span class="badge bg-info-subtle text-info small" style="font-size: 0.65rem;">
              <i class="fa-solid fa-circle text-secondary me-1 small" id="aiChatStatusDot"></i><span id="aiChatStatusText">Checking AI...</span>
            </span>
          </div>
        </div>
        <div class="d-flex align-items-center gap-1">
          <button class="btn btn-sm btn-link text-white-50 p-1" onclick="clearChatHistory()" title="Clear Chat">
            <i class="fa-solid fa-rotate-left"></i>
          </button>
          <button class="btn btn-sm btn-link text-white p-1" onclick="toggleChatWindow()" title="Close">
            <i class="fa-solid fa-xmark fa-lg"></i>
          </button>
        </div>
      </div>

      <!-- Quick Suggestion Chips -->
      <div class="px-3 py-2 border-bottom border-glass overflow-x-auto text-nowrap" id="chatSuggestionChips" style="max-height: 48px;">
        <button class="btn btn-sm btn-outline-primary rounded-pill py-0 px-2 me-1 small" onclick="sendSuggestedQuery('Can I do Data Science after PCB?')">
          PCB to Data Science?
        </button>
        <button class="btn btn-sm btn-outline-primary rounded-pill py-0 px-2 me-1 small" onclick="sendSuggestedQuery('Best colleges in Pune under 5 Lakh budget?')">
          Pune Colleges < 5L
        </button>
        <button class="btn btn-sm btn-outline-primary rounded-pill py-0 px-2 me-1 small" onclick="sendSuggestedQuery('10th me average marks hain, kya Polytechnic safe hai?')">
          Polytechnic safe?
        </button>
      </div>

      <!-- Message History Container -->
      <div id="chatMessages" class="chat-messages p-3">
        <div class="chat-bubble bot-bubble">
          <div class="fw-semibold text-primary small mb-1">MargDarshak Sahayak:</div>
          <div class="bubble-text small">
            Namaste! I am your AI Career & Education Counselor. You can ask me any question in <strong>English, हिंदी, or मराठी</strong> about streams, colleges, loan traps, or competitive exams!
          </div>
        </div>
      </div>

      <!-- Input Area -->
      <div class="chat-input-area p-2 border-top border-glass">
        <form id="chatForm" onsubmit="handleChatSubmit(event)" class="d-flex align-items-center gap-2">
          <button type="button" id="voiceMicBtn" class="btn btn-outline-secondary btn-sm rounded-circle" onclick="toggleVoiceRecognition()" title="Voice Input (Speech-to-Text)">
            <i class="fa-solid fa-microphone"></i>
          </button>
          <input type="text" id="chatInputText" class="form-control form-control-sm border border-glass rounded-pill px-3" placeholder="Ask in English, हिंदी, or मराठी..." required autocomplete="off">
          <button type="submit" class="btn btn-primary btn-sm rounded-circle d-flex align-items-center justify-content-center" style="width: 34px; height: 34px;">
            <i class="fa-solid fa-paper-plane fa-xs"></i>
          </button>
        </form>
      </div>
    </div>
  `;

  document.body.appendChild(chatDiv);
};

const toggleChatWindow = () => {
  const win = document.getElementById('chatWindow');
  if (win) {
    win.classList.toggle('d-none');
    if (!win.classList.contains('d-none')) {
      document.getElementById('chatInputText')?.focus();
    }
  }
};

const sendSuggestedQuery = (text) => {
  const input = document.getElementById('chatInputText');
  if (input) {
    input.value = text;
    handleChatSubmit(new Event('submit'));
  }
};

const handleChatSubmit = async (e) => {
  if (e && e.preventDefault) e.preventDefault();
  const input = document.getElementById('chatInputText');
  const msg = input.value.trim();
  if (!msg) return;

  // Append user message
  appendMessage('user', msg);
  input.value = '';

  // Show typing indicator
  const typingId = appendTypingIndicator();

  const currentLang = typeof window.currentLanguage === 'function' ? window.currentLanguage() : 'en';

  try {
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: msg,
        history: chatHistory.slice(-6),
        studentProfile: window.currentStudentProfile || {},
        language: currentLang
      })
    });
    const data = await res.json();
    removeTypingIndicator(typingId);
    window.refreshAIEngineStatus?.();

    if (data.success && data.reply) {
      appendMessage('bot', data.reply, data.source);
      chatHistory.push({ role: 'user', content: msg });
      chatHistory.push({ role: 'assistant', content: data.reply });
    } else {
      appendMessage('bot', 'I apologize, could you please rephrase your question?');
    }
  } catch (err) {
    removeTypingIndicator(typingId);
    appendMessage('bot', 'Network error. Please try again.');
  }
};

const appendMessage = (sender, text, source) => {
  const container = document.getElementById('chatMessages');
  if (!container) return;

  const bubble = document.createElement('div');
  bubble.className = `chat-bubble ${sender}-bubble mb-3`;

  if (sender === 'user') {
    bubble.innerHTML = `<div class="bubble-text small">${escapeHTML(text)}</div>`;
  } else {
    bubble.innerHTML = `
      <div class="d-flex justify-content-between align-items-center mb-1">
        <span class="fw-semibold text-primary small">MargDarshak AI</span>
        <button class="btn btn-sm btn-link text-muted p-0" onclick="speakText('${escapeQuotes(text)}')" title="Listen (Text-to-Speech)">
          <i class="fa-solid fa-volume-high fa-xs"></i>
        </button>
      </div>
      <div class="bubble-text small">${formatMarkdown(text)}</div>
      ${source ? `<div class="text-muted mt-1" style="font-size: 0.65rem;"><i class="fa-solid fa-check-double text-success me-1"></i>${source}</div>` : ''}
    `;
  }

  container.appendChild(bubble);
  container.scrollTop = container.scrollHeight;
};

const appendTypingIndicator = () => {
  const container = document.getElementById('chatMessages');
  if (!container) return null;
  const id = 'typing_' + Date.now();
  const typing = document.createElement('div');
  typing.id = id;
  typing.className = 'chat-bubble bot-bubble mb-2';
  typing.innerHTML = `
    <div class="d-flex align-items-center gap-1 text-muted small py-1">
      <span>AI is analyzing options</span>
      <div class="spinner-grow spinner-grow-sm text-primary" style="width: 6px; height: 6px;" role="status"></div>
      <div class="spinner-grow spinner-grow-sm text-primary" style="width: 6px; height: 6px;" role="status"></div>
      <div class="spinner-grow spinner-grow-sm text-primary" style="width: 6px; height: 6px;" role="status"></div>
    </div>
  `;
  container.appendChild(typing);
  container.scrollTop = container.scrollHeight;
  return id;
};

const removeTypingIndicator = (id) => {
  if (!id) return;
  const el = document.getElementById(id);
  if (el) el.remove();
};

const clearChatHistory = () => {
  chatHistory = [];
  const container = document.getElementById('chatMessages');
  if (container) {
    container.innerHTML = `
      <div class="chat-bubble bot-bubble">
        <div class="bubble-text small text-muted">Chat cleared. Ask anything!</div>
      </div>
    `;
  }
};

/**
 * Speech Recognition (Speech-to-Text)
 */
const toggleVoiceRecognition = () => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert('Speech Recognition is not supported on this browser. Please use Chrome or Edge.');
    return;
  }

  const micBtn = document.getElementById('voiceMicBtn');
  if (isRecognitionActive) {
    isRecognitionActive = false;
    if (micBtn) micBtn.classList.remove('btn-danger', 'text-white');
    return;
  }

  const recognition = new SpeechRecognition();
  const currentLang = typeof window.currentLanguage === 'function' ? window.currentLanguage() : 'en';
  recognition.lang = currentLang === 'mr' ? 'mr-IN' : currentLang === 'hi' ? 'hi-IN' : 'en-IN';
  recognition.interimResults = false;

  recognition.onstart = () => {
    isRecognitionActive = true;
    if (micBtn) {
      micBtn.classList.add('btn-danger', 'text-white');
      micBtn.title = 'Listening... Speak now!';
    }
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    const input = document.getElementById('chatInputText');
    if (input) {
      input.value = transcript;
      handleChatSubmit(new Event('submit'));
    }
  };

  recognition.onerror = () => {
    isRecognitionActive = false;
    if (micBtn) micBtn.classList.remove('btn-danger', 'text-white');
  };

  recognition.onend = () => {
    isRecognitionActive = false;
    if (micBtn) micBtn.classList.remove('btn-danger', 'text-white');
  };

  recognition.start();
};

/**
 * Speech Synthesis (Text-to-Speech)
 */
const speakText = (text) => {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel(); // Stop any active audio
  const cleanText = text.replace(/[*_#`]/g, '');
  const utterance = new SpeechSynthesisUtterance(cleanText);
  const currentLang = typeof window.currentLanguage === 'function' ? window.currentLanguage() : 'en';
  utterance.lang = currentLang === 'mr' ? 'mr-IN' : currentLang === 'hi' ? 'hi-IN' : 'en-IN';
  utterance.rate = 1.0;
  window.speechSynthesis.speak(utterance);
};

const escapeHTML = (str) => {
  return str.replace(/[&<>'"]/g, tag => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[tag] || tag));
};

const escapeQuotes = (str) => {
  return str.replace(/['"\\]/g, ' ').replace(/\n/g, ' ');
};

const formatMarkdown = (str) => {
  return str
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>');
};

document.addEventListener('DOMContentLoaded', () => {
  initChatbot();
});

window.toggleChatWindow = toggleChatWindow;
window.sendSuggestedQuery = sendSuggestedQuery;
window.handleChatSubmit = handleChatSubmit;
window.clearChatHistory = clearChatHistory;
window.toggleVoiceRecognition = toggleVoiceRecognition;
window.speakText = speakText;
