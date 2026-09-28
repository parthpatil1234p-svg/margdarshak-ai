/**
 * Gemini AI Client configuration with dual-mode support:
 * 1. Live Google Gemini API with structured JSON response parsing
 * 2. Deterministic AI Reasoning Fallback Engine for offline/demo robustness
 */

const getGeminiAPIKey = () => process.env.GEMINI_API_KEY || '';

let geminiConnectionState = 'unverified';
let activeGeminiModel = null;

const isGeminiAvailable = () => {
  const key = getGeminiAPIKey();
  return Boolean(key && key.trim().length > 10 && !key.includes('YOUR_API_KEY'));
};

const getGeminiStatus = () => {
  const configured = isGeminiAvailable();
  if (!configured) {
    return { configured: false, connected: false, state: 'fallback', model: null };
  }

  return {
    configured: true,
    connected: geminiConnectionState === 'connected',
    state: geminiConnectionState,
    model: activeGeminiModel
  };
};

/**
 * Call Gemini API with structured JSON output enforcement
 * @param {string} prompt - Prompt to send to Gemini
 * @param {string} [systemInstruction] - Optional system instruction
 * @returns {Promise<any|null>} Parsed JSON or null on failure
 */
const generateJSONWithGemini = async (prompt, systemInstruction = '') => {
  if (!isGeminiAvailable()) {
    return null;
  }

  const apiKey = getGeminiAPIKey();
  const models = ['gemini-3.8-flash', 'gemini-3.5-flash-lite', 'gemini-3.5-flash'];
  let usableResponseReceived = false;

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
      const payload = {
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          topP: 0.9,
          responseMimeType: 'application/json'
        }
      };

      if (systemInstruction) {
        payload.systemInstruction = {
          parts: [{ text: systemInstruction }]
        };
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const apiError = await response.json().catch(() => null);
        const rawProviderMessage = apiError?.error?.message;
        const providerMessage = typeof rawProviderMessage === 'string'
          ? rawProviderMessage.replace(/[\r\n]+/g, ' ').slice(0, 160)
          : null;
        const providerStatus = apiError?.error?.status;
        console.warn(`[Gemini API] Model ${model} returned HTTP ${response.status}${providerStatus ? ` (${providerStatus})` : ''}${providerMessage ? `: ${providerMessage}` : '.'}`);
        continue; // Try next model or fallback
      }

      const data = await response.json();
      const textOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (textOutput) {
        const parsedOutput = JSON.parse(textOutput);
        if (parsedOutput && typeof parsedOutput === 'object' && !Array.isArray(parsedOutput)) {
          usableResponseReceived = true;
          geminiConnectionState = 'connected';
          activeGeminiModel = model;
          return parsedOutput;
        }
      }
    } catch (err) {
      console.warn(`[Gemini Client Warning] Attempt with ${model} failed (${err.name || 'Error'}).`);
    }
  }

  if (!usableResponseReceived) {
    geminiConnectionState = 'unavailable';
    activeGeminiModel = null;
  }

  return null;
};

module.exports = {
  getGeminiAPIKey,
  isGeminiAvailable,
  getGeminiStatus,
  generateJSONWithGemini
};
