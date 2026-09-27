const app = require('../src/app');
const http = require('http');

async function runTests() {
  console.log('🧪 Starting MargDarshak AI Automated Verification Suite...\n');
  const server = http.createServer(app);
  await new Promise(resolve => server.listen(5099, resolve));
  const baseUrl = 'http://localhost:5099';

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

  // 1. Health endpoint
  await test('GET /api/health returns online status', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    const data = await res.json();
    if (data.status !== 'online' || !data.service) {
      throw new Error(`Expected online status, got: ${JSON.stringify(data)}`);
    }
  });

  // 2. Assessment evaluation
  let assessmentProfile = null;
  await test('POST /api/assessment/evaluate evaluates intake and recommends streams', async () => {
    const payload = {
      fullName: 'Aarav Sharma',
      marks: { math: 84, science: 88, english: 78, social: 80 },
      interests: ['Coding & Software', 'Robotics'],
      maxBudgetINR: 600000,
      preferredLocation: 'India',
      riskTolerance: 'Moderate',
      targetAspiration: 'Software Architect'
    };
    const res = await fetch(`${baseUrl}/api/assessment/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!data.success || !data.recommendedStreams || data.recommendedStreams.length === 0) {
      throw new Error(`Invalid assessment response: ${JSON.stringify(data)}`);
    }
    assessmentProfile = data.profile;
  });

  // 3. Pathway simulation
  let simulatedPathways = null;
  await test('POST /api/pathways/simulate generates 3 sequential multi-stage pathways', async () => {
    const res = await fetch(`${baseUrl}/api/pathways/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(assessmentProfile)
    });
    const data = await res.json();
    if (!data.success || data.pathways.length !== 3) {
      throw new Error(`Expected 3 pathways, got: ${data.pathways?.length}`);
    }
    simulatedPathways = data.pathways;
    // Verify each pathway has 5 stages
    for (const p of data.pathways) {
      if (!p.stages || p.stages.length < 4) {
        throw new Error(`Pathway ${p.pathwayName} has insufficient stages: ${p.stages?.length}`);
      }
    }
  });

  // 4. What-If Scenario simulation
  await test('POST /api/what-if/simulate executes NEET_FAIL scenario pivot', async () => {
    const payload = {
      scenarioId: 'NEET_FAIL',
      currentPath: simulatedPathways[0]
    };
    const res = await fetch(`${baseUrl}/api/what-if/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!data.success || !data.impactAnalysis || !data.pivotedPathway) {
      throw new Error(`Invalid what-if simulation response: ${JSON.stringify(data)}`);
    }
  });

  // 5. Loan ROI calculation
  await test('POST /api/finance/calculate-loan accurately computes EMI and payback', async () => {
    const payload = {
      totalEducationCostINR: 1200000,
      familyContributionINR: 400000,
      scholarshipINR: 100000,
      annualInterestRate: 9.5,
      tenureYears: 7,
      medianStartingSalaryINR: 1000000
    };
    const res = await fetch(`${baseUrl}/api/finance/calculate-loan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!data.success || data.calculation.principalLoanINR !== 700000 || data.calculation.monthlyEMI <= 0) {
      throw new Error(`Calculation error: ${JSON.stringify(data.calculation)}`);
    }
  });

  // 6. Scholarships matching
  await test('GET /api/scholarships/match returns matching scholarships', async () => {
    const res = await fetch(`${baseUrl}/api/scholarships/match?marks=85&familyIncomeINR=500000`);
    const data = await res.json();
    if (!data.success || data.count === 0) {
      throw new Error(`No scholarships returned`);
    }
  });

  // 7. Explainable Decision Matrix
  await test('POST /api/matrix/compare returns side-by-side comparison matrix', async () => {
    const res = await fetch(`${baseUrl}/api/matrix/compare`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pathways: simulatedPathways })
    });
    const data = await res.json();
    if (!data.success || !data.matrix || data.matrix.length < 5) {
      throw new Error(`Matrix comparison failed: ${JSON.stringify(data)}`);
    }
  });

  server.close();
  console.log(`\n📊 Verification Summary: ${passed} passed, ${failed} failed.`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
