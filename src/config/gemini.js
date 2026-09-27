/**
 * Gemini AI Client configuration with dual-mode support:
 * 1. Live Google Gemini API with structured JSON response parsing
 * 2. Deterministic AI Reasoning Fallback Engine for offline/demo robustness
 */

const getGeminiAPIKey = () => process.env.GEMINI_API_KEY || '';

const isGeminiAvailable = () => {
  const key = getGeminiAPIKey();
  return Boolean(key && key.trim().length > 10 && !key.includes('YOUR_API_KEY'));
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
  const models = ['gemini-1.5-flash', 'gemini-2.5-flash'];

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errText = await response.text();
        console.warn(`[Gemini API] Model ${model} returned ${response.status}: ${errText.slice(0, 150)}`);
        continue; // Try next model or fallback
      }

      const data = await response.json();
      const textOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (textOutput) {
        return JSON.parse(textOutput);
      }
    } catch (err) {
      console.warn(`[Gemini Client Warning] Attempt with ${model} failed: ${err.message}`);
    }
  }

  return null;
};

module.exports = {
  getGeminiAPIKey,
  isGeminiAvailable,
  generateJSONWithGemini
};
