const app = require('../src/app');
const http = require('http');

async function runChatTests() {
  console.log('🧪 Starting MargDarshak AI Chatbot Test Suite...\n');
  const server = http.createServer(app);
  await new Promise(resolve => server.listen(5097, resolve));
  const baseUrl = 'http://localhost:5097';

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`✅ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`❌ [FAIL] ${name}: ${err.message}`);
      failed++;
    }
  }

  // 1. English chat
  await test('POST /api/ai/chat returns counseling reply in English', async () => {
    const res = await fetch(`${baseUrl}/api/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Can I do Data Science after PCB?',
        language: 'en'
      })
    });
    const data = await res.json();
    if (!data.success || !data.reply || data.language !== 'en') {
      throw new Error(`Invalid response: ${JSON.stringify(data)}`);
    }
  });

  // 2. Hindi chat
  await test('POST /api/ai/chat returns counseling reply in Hindi', async () => {
    const res = await fetch(`${baseUrl}/api/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Kya PCB ke baad Data Science kar sakte hain?',
        language: 'hi'
      })
    });
    const data = await res.json();
    if (!data.success || !data.reply || data.language !== 'hi') {
      throw new Error(`Invalid response: ${JSON.stringify(data)}`);
    }
  });

  // 3. Marathi chat
  await test('POST /api/ai/chat returns counseling reply in Marathi', async () => {
    const res = await fetch(`${baseUrl}/api/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'पुण्यात ५ लाखांच्या आत चांगले कॉलेज कोणते?',
        language: 'mr'
      })
    });
    const data = await res.json();
    if (!data.success || !data.reply || data.language !== 'mr') {
      throw new Error(`Invalid response: ${JSON.stringify(data)}`);
    }
  });

  server.close();
  console.log(`\n📊 Chat Verification Summary: ${passed} passed, ${failed} failed.`);
  if (failed > 0) {
    process.exit(1);
  }
}

runChatTests();
