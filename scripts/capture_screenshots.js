const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = path.join(__dirname, '..', 'docs', 'screenshots');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function captureAll() {
  console.log('🚀 Launching Headless Chrome via Puppeteer-Core...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    defaultViewport: {
      width: 1440,
      height: 900,
      deviceScaleFactor: 2
    },
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const page = await browser.newPage();
  
  // Set console listener for debugging
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  console.log('🌐 Navigating to http://localhost:5000...');
  await page.goto('http://localhost:5000', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));

  // 1. Hero & Intake Screen (Persona Aarav loaded)
  console.log('📸 1. Capturing Hero & Intake Dashboard...');
  // Click on Persona Aarav button
  await page.evaluate(() => {
    const btn = document.querySelector('button[onclick*="Aarav"]') || document.querySelectorAll('.persona-btn, .btn-outline-primary, [onclick*="loadPersona"]')[0];
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(OUTPUT_DIR, '01_hero_intake.png'), fullPage: false });

  // 2. Simulate Pathways
  console.log('📸 2. Simulating Pathways & Capturing 3-Tier Multi-Pathway Visualizer...');
  await page.evaluate(() => {
    if (typeof window.quickJudgeSimulate === 'function') {
      window.quickJudgeSimulate();
    } else {
      const simBtn = document.querySelector('#simulate-btn, #btn-simulate, button[onclick*="simulatePathways"], button[type="submit"]');
      if (simBtn) simBtn.click();
    }
  });
  await new Promise(r => setTimeout(r, 1200));

  // Switch to Pathways Tab
  await page.evaluate(() => {
    const pathwayTab = document.querySelector('#tab-pathways, [data-bs-target="#pane-pathways"], a[href="#pane-pathways"], [onclick*="pathways"]');
    if (pathwayTab) pathwayTab.click();
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(OUTPUT_DIR, '02_pathways_3tier.png'), fullPage: false });

  // 3. What-If Contingency Engine
  console.log('📸 3. Triggering What-If Contingency Engine...');
  await page.evaluate(() => {
    const whatIfTab = document.querySelector('#tab-whatif, [data-bs-target="#pane-whatif"], a[href="#pane-whatif"], [onclick*="whatif"]');
    if (whatIfTab) whatIfTab.click();
    if (typeof window.quickJudgeWhatIf === 'function') {
      window.quickJudgeWhatIf();
    }
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(OUTPUT_DIR, '03_whatif_contingency.png'), fullPage: false });

  // 4. Financial Feasibility & Loan ROI
  console.log('📸 4. Capturing Financial Feasibility & Scholarship Engine...');
  await page.evaluate(() => {
    const finTab = document.querySelector('#tab-loan, [data-bs-target="#pane-loan"], a[href="#pane-loan"], [onclick*="loan"], [data-bs-target="#pane-finance"]');
    if (finTab) finTab.click();
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(OUTPUT_DIR, '04_financial_loan_roi.png'), fullPage: false });

  // 5. Decision Matrix & PDF Dossier
  console.log('📸 5. Capturing Decision Matrix & Comparison Table...');
  await page.evaluate(() => {
    const matrixTab = document.querySelector('#tab-matrix, [data-bs-target="#pane-matrix"], a[href="#pane-matrix"], [onclick*="matrix"]');
    if (matrixTab) matrixTab.click();
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(OUTPUT_DIR, '05_decision_matrix.png'), fullPage: false });

  // 6. RIASEC Assessment Modal
  console.log('📸 6. Capturing RIASEC Quiz Modal...');
  await page.evaluate(() => {
    const quizBtn = document.querySelector('#btn-open-riasec, button[onclick*="riasec"], button[data-bs-target="#riasecModal"]');
    if (quizBtn) quizBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(OUTPUT_DIR, '06_riasec_quiz.png'), fullPage: false });

  // Close modal
  await page.evaluate(() => {
    const closeBtn = document.querySelector('#riasecModal .btn-close, #riasecModal .btn-secondary');
    if (closeBtn) closeBtn.click();
  });
  await new Promise(r => setTimeout(r, 500));

  // 7. Multilingual AI Counselor
  console.log('📸 7. Capturing AI Counselor Chat Window...');
  await page.evaluate(() => {
    const chatToggle = document.querySelector('#btn-chat-toggle, #chat-toggle-btn, .chat-fab, button[onclick*="toggleChat"]');
    if (chatToggle) chatToggle.click();
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(OUTPUT_DIR, '07_ai_counselor_chat.png'), fullPage: false });

  console.log('✅ All 7 UI Screenshots successfully captured in:', OUTPUT_DIR);

  await browser.close();
}

captureAll().catch(err => {
  console.error('❌ Error capturing screenshots:', err);
  process.exit(1);
});
