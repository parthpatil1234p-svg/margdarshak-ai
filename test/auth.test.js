const app = require('../src/app');
const http = require('http');

async function runAuthTests() {
  console.log('🧪 Starting MargDarshak AI Auth & Saved Roadmaps Test Suite...\n');
  const server = http.createServer(app);
  await new Promise(resolve => server.listen(5098, resolve));
  const baseUrl = 'http://localhost:5098';

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

  // 1. Register User
  let authToken = null;
  const testEmail = `student_${Date.now()}@example.com`;
  await test('POST /api/auth/register creates user account with hashed password', async () => {
    const res = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Rohan Deshmukh',
        email: testEmail,
        password: 'Password@123',
        userType: 'Student',
        targetAspiration: 'Software Architect'
      })
    });
    const data = await res.json();
    if (!data.success || !data.token) {
      throw new Error(`Registration failed: ${JSON.stringify(data)}`);
    }
    authToken = data.token;
  });

  // 2. Prevent Duplicate Register
  await test('POST /api/auth/register rejects duplicate email', async () => {
    const res = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Rohan Duplicate',
        email: testEmail,
        password: 'Password@123'
      })
    });
    const data = await res.json();
    if (data.success || res.status !== 400) {
      throw new Error(`Expected failure for duplicate email, got: ${JSON.stringify(data)}`);
    }
  });

  // 3. Login User
  await test('POST /api/auth/login authenticates valid credentials', async () => {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'Password@123'
      })
    });
    const data = await res.json();
    if (!data.success || !data.token) {
      throw new Error(`Login failed: ${JSON.stringify(data)}`);
    }
  });

  // 4. 1-Click Demo Judge Login
  let judgeToken = null;
  await test('POST /api/auth/demo-judge-login returns pre-seeded judge session', async () => {
    const res = await fetch(`${baseUrl}/api/auth/demo-judge-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!data.success || !data.token || data.user.userType !== 'Judge') {
      throw new Error(`Judge login failed: ${JSON.stringify(data)}`);
    }
    judgeToken = data.token;
  });

  // 5. Get User Profile (/api/auth/me)
  await test('GET /api/auth/me returns current user profile and saved roadmaps', async () => {
    const res = await fetch(`${baseUrl}/api/auth/me`, {
      headers: { Authorization: `Bearer ${judgeToken}` }
    });
    const data = await res.json();
    if (!data.success || !data.user || data.user.userType !== 'Judge') {
      throw new Error(`Get me failed: ${JSON.stringify(data)}`);
    }
  });

  // 6. Save a Career Roadmap
  let savedRoadmapId = null;
  await test('POST /api/auth/save-roadmap persists simulation to profile', async () => {
    const payload = {
      title: 'Aarav - My Target Science Roadmap',
      studentName: 'Aarav Sharma',
      profileSnapshot: {
        fullName: 'Aarav Sharma',
        marks: { math: 75, science: 85, english: 75, social: 75 },
        maxBudgetINR: 600000
      },
      pathwaysSnapshot: [{ pathwayName: 'Applied Industry Route', totalCost: 820000 }],
      notes: 'Reviewed with parents on Saturday.'
    };
    const res = await fetch(`${baseUrl}/api/auth/save-roadmap`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!data.success || !data.savedRoadmap) {
      throw new Error(`Save roadmap failed: ${JSON.stringify(data)}`);
    }
    savedRoadmapId = data.savedRoadmap._id;
  });

  // 7. Get Saved Roadmaps
  await test('GET /api/auth/saved-roadmaps lists saved roadmaps for user', async () => {
    const res = await fetch(`${baseUrl}/api/auth/saved-roadmaps`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    const data = await res.json();
    if (!data.success || data.count < 1) {
      throw new Error(`Expected at least 1 saved roadmap, got: ${JSON.stringify(data)}`);
    }
  });

  // 8. Delete Saved Roadmap
  await test('DELETE /api/auth/saved-roadmaps/:id deletes roadmap', async () => {
    const res = await fetch(`${baseUrl}/api/auth/saved-roadmaps/${savedRoadmapId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${authToken}` }
    });
    const data = await res.json();
    if (!data.success) {
      throw new Error(`Delete failed: ${JSON.stringify(data)}`);
    }
  });

  server.close();
  console.log(`\n📊 Auth Verification Summary: ${passed} passed, ${failed} failed.`);
  if (failed > 0) {
    process.exit(1);
  }
}

runAuthTests();
