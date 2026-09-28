/**
 * MargDarshak AI - Main Application Coordinator
 */

// Global State
window.currentStudentProfile = null;
window.currentPathways = [];
window.counselingData = null;

const renderAIEngineStatus = (engine = {}) => {
  const configured = Boolean(engine.geminiConfigured);
  const state = engine.state || (configured ? 'unverified' : 'fallback');
  const status = {
    connected: {
      label: 'Gemini Online',
      detail: `${engine.model || 'Gemini'} responded successfully; offline fallback remains available.`,
      color: 'success'
    },
    unavailable: {
      label: 'Offline Fallback Active',
      detail: 'Gemini did not respond; the built-in offline guidance is active.',
      color: 'warning'
    },
    unverified: {
      label: 'Gemini Connection Unverified',
      detail: 'Gemini is configured but has not successfully responded yet.',
      color: 'info'
    },
    fallback: {
      label: 'Offline AI Ready',
      detail: 'Gemini is not configured; built-in offline guidance is ready.',
      color: 'info'
    }
  }[state] || {
    label: 'AI Status Unavailable',
    detail: 'Could not retrieve AI status; replies may use offline guidance.',
    color: 'secondary'
  };

  ['aiEngineStatusText', 'aiChatStatusText'].forEach((id) => {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = status.label;
      element.title = status.detail;
    }
  });

  const sidebarDot = document.getElementById('aiEngineStatusDot');
  if (sidebarDot) sidebarDot.className = `badge-status-dot bg-${status.color}`;

  const chatDot = document.getElementById('aiChatStatusDot');
  if (chatDot) chatDot.className = `fa-solid fa-circle text-${status.color} me-1 small`;
};

window.refreshAIEngineStatus = async () => {
  try {
    const response = await fetch('/api/health', { cache: 'no-store' });
    if (!response.ok) throw new Error(`Status request failed (${response.status})`);
    const data = await response.json();
    renderAIEngineStatus(data.aiEngine);
  } catch (_) {
    renderAIEngineStatus({ state: 'unknown' });
  }
};

// Preset Personas for 1-click Hackathon Demonstrations
const DEMO_PERSONAS = {
  PERSONA_A: {
    fullName: 'Aarav Sharma (Confused 10th Grader)',
    grade: 10,
    marks: { math: 68, science: 86, english: 78, social: 75 },
    interests: ['Biology & Life Sciences', 'Coding & Software', 'Robotics'],
    aptitudes: ['Investigative', 'Hands-on Building'],
    maxBudgetINR: 600000,
    preferredLocation: 'India',
    riskTolerance: 'Moderate',
    targetAspiration: 'Biotech / Healthcare Tech',
    category: 'General',
    stateDomicile: 'Maharashtra'
  },
  PERSONA_B: {
    fullName: 'Rajesh Patil (Pragmatic Middle-Class Parent)',
    grade: 10,
    marks: { math: 74, science: 76, english: 70, social: 72 },
    interests: ['Applied Engineering', 'Computers & Automation'],
    aptitudes: ['Practical Problem Solving', 'Quantitative Logic'],
    maxBudgetINR: 400000,
    preferredLocation: 'India',
    riskTolerance: 'Conservative',
    targetAspiration: 'Software or Automation Engineer (Zero Debt Focus)',
    category: 'OBC',
    stateDomicile: 'Maharashtra'
  },
  PERSONA_C: {
    fullName: 'Ananya Sen (High Aspirant Global Scholar)',
    grade: 10,
    marks: { math: 94, science: 96, english: 92, social: 88 },
    interests: ['AI & Machine Learning', 'Pure Mathematics', 'Global Research'],
    aptitudes: ['Analytical Thinking', 'Systemic Reasoning'],
    maxBudgetINR: 2500000,
    preferredLocation: 'Both',
    riskTolerance: 'Ambitious',
    targetAspiration: 'AI Research Scientist / Global Tech',
    category: 'General',
    stateDomicile: 'Delhi'
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // Initialize user settings, what-if presets, and loan calculator
  applyStoredSettings();
  if (typeof initWhatIfScenarios === 'function') initWhatIfScenarios();
  if (typeof initLoanCalculator === 'function') initLoanCalculator();
  window.refreshAIEngineStatus?.();

  // Setup form submission handler
  const intakeForm = document.getElementById('intakeAssessmentForm');
  if (intakeForm) {
    intakeForm.addEventListener('submit', handleIntakeSubmit);
  }

  // Auto-update overall marks percentage on score inputs
  const markInputs = ['marksMath', 'marksScience', 'marksEnglish', 'marksSocial'];
  markInputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', calculateAverageMarks);
  });

  // Sync sidebar active links and update topbar breadcrumb
  const sidebarLinks = document.querySelectorAll('.sidebar-link[data-bs-toggle="pill"]');
  const breadcrumbTitle = document.getElementById('currentSectionTitle');
  const sidebar = document.getElementById('appSidebar');
  const backdrop = document.getElementById('sidebarBackdrop');

  sidebarLinks.forEach(link => {
    link.addEventListener('shown.bs.tab', (e) => {
      sidebarLinks.forEach(l => l.classList.remove('active'));
      e.target.classList.add('active');

      const title = e.target.getAttribute('data-section-title') || e.target.innerText.trim();
      if (breadcrumbTitle) breadcrumbTitle.textContent = title;

      const isContentHeavyView = ['pills-whatif-tab', 'pills-matrix-tab'].includes(e.target.id);
      document.body.classList.toggle('content-heavy-view-active', isContentHeavyView);
      if (isContentHeavyView) document.getElementById('chatWindow')?.classList.add('d-none');

      // Close mobile drawer if open
      if (window.innerWidth < 992 && sidebar && sidebar.classList.contains('show')) {
        sidebar.classList.remove('show');
        if (backdrop) backdrop.classList.remove('show');
      }
    });
  });

  // Mobile sidebar drawer toggles
  const sidebarToggle = document.getElementById('sidebarToggle');
  if (sidebarToggle && sidebar && backdrop) {
    sidebarToggle.addEventListener('click', () => {
      const isOpen = sidebar.classList.toggle('show');
      backdrop.classList.toggle('show', isOpen);
    });

    backdrop.addEventListener('click', () => {
      sidebar.classList.remove('show');
      backdrop.classList.remove('show');
    });
  }

  const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');
  if (sidebarCloseBtn && sidebar && backdrop) {
    sidebarCloseBtn.addEventListener('click', () => {
      sidebar.classList.remove('show');
      backdrop.classList.remove('show');
    });
  }

  // Load Persona A by default to give judges an instant live experience!
  loadPersona('PERSONA_A');
});

const calculateAverageMarks = () => {
  const math = Number(document.getElementById('marksMath')?.value || 0);
  const sci = Number(document.getElementById('marksScience')?.value || 0);
  const eng = Number(document.getElementById('marksEnglish')?.value || 0);
  const soc = Number(document.getElementById('marksSocial')?.value || 0);
  const avg = Math.round(((math + sci + eng + soc) / 4) * 10) / 10;
  const avgDisplay = document.getElementById('calculatedAvgMarks');
  if (avgDisplay) avgDisplay.innerText = `${avg}%`;
};

const loadPersona = (personaKey) => {
  const persona = DEMO_PERSONAS[personaKey];
  if (!persona) return;

  document.getElementById('studentName').value = persona.fullName;
  document.getElementById('marksMath').value = persona.marks.math;
  document.getElementById('marksScience').value = persona.marks.science;
  document.getElementById('marksEnglish').value = persona.marks.english;
  document.getElementById('marksSocial').value = persona.marks.social;
  document.getElementById('maxBudgetINR').value = persona.maxBudgetINR;
  document.getElementById('budgetSliderLabel').innerText = `₹${(persona.maxBudgetINR / 100000).toFixed(1)} Lakhs`;
  document.getElementById('locationPreference').value = persona.preferredLocation;
  document.getElementById('riskTolerance').value = persona.riskTolerance;
  document.getElementById('targetAspiration').value = persona.targetAspiration;
  document.getElementById('studentCategory').value = persona.category;

  // Set interest checkboxes
  document.querySelectorAll('input[name="interests"]').forEach(cb => {
    cb.checked = persona.interests.includes(cb.value);
  });

  calculateAverageMarks();

  // Highlight active persona button
  document.querySelectorAll('.persona-btn, .persona-pill-btn').forEach(btn => {
    btn.classList.remove('border-primary', 'bg-light', 'active');
  });
  const activeBtns = document.querySelectorAll(`[id="btn_${personaKey}"]`);
  activeBtns.forEach(btn => {
    btn.classList.add('border-primary', 'bg-light', 'active');
  });

  // Automatically execute simulation for seamless demo
  simulateCareerRoadmap(persona);
};

const handleIntakeSubmit = async (e) => {
  e.preventDefault();

  const selectedInterests = Array.from(document.querySelectorAll('input[name="interests"]:checked')).map(cb => cb.value);

  const profile = {
    fullName: document.getElementById('studentName').value || 'Student Aspirant',
    grade: 10,
    marks: {
      math: Number(document.getElementById('marksMath').value || 70),
      science: Number(document.getElementById('marksScience').value || 70),
      english: Number(document.getElementById('marksEnglish').value || 70),
      social: Number(document.getElementById('marksSocial').value || 70)
    },
    interests: selectedInterests.length ? selectedInterests : ['Coding & Software'],
    maxBudgetINR: Number(document.getElementById('maxBudgetINR').value || 600000),
    preferredLocation: document.getElementById('locationPreference').value,
    riskTolerance: document.getElementById('riskTolerance').value,
    targetAspiration: document.getElementById('targetAspiration').value,
    category: document.getElementById('studentCategory').value
  };

  await simulateCareerRoadmap(profile);
};

const simulateCareerRoadmap = async (profile) => {
  const loading = document.getElementById('simulationLoading');
  if (loading) loading.classList.remove('d-none');

  try {
    // 1. Evaluate Assessment
    const evalRes = await fetch('/api/assessment/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile)
    });
    const evalData = await evalRes.json();
    window.currentStudentProfile = evalData.profile;

    // 2. Generate Pathways
    const pathRes = await fetch('/api/pathways/simulate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(evalData.profile)
    });
    const pathData = await pathRes.json();

    if (pathData.success) {
      window.currentPathways = pathData.pathways;
      window.counselingData = pathData.aiCounseling;

      // Render Visualizer
      renderCounselorGuidance(pathData.aiCounseling);
      renderPathways(pathData.pathways);

      // Render Decision Matrix
      renderDecisionMatrix(pathData.pathways);

      // Trigger UX enhancements
      if (typeof window.markStepComplete === 'function') {
        window.markStepComplete(1);
        window.markStepComplete(2);
      }
      if (typeof window.showToast === 'function') {
        window.showToast('Career Pathways Generated', 'Generated 3 parallel pathways with zero-regret milestones', 'fa-route', 'success');
      }

      // Sync loan calculator total cost from primary pathway
      const primaryCost = pathData.pathways[0]?.financialSummary?.totalCostINR || 1200000;
      const loanCostSlider = document.getElementById('loanTotalCost');
      if (loanCostSlider) {
        loanCostSlider.value = primaryCost;
        if (typeof updateLoanCalculations === 'function') updateLoanCalculations();
      }

      // Update what-if active pathway
      if (typeof setCurrentActivePathway === 'function') {
        setCurrentActivePathway(pathData.pathways[0]);
      }

      // Switch to roadmap tab if user clicked submit
      const roadmapTab = document.getElementById('pills-roadmap-tab');
      if (roadmapTab) {
        const bsTab = new bootstrap.Tab(roadmapTab);
        bsTab.show();
      }
      window.refreshAIEngineStatus?.();
    }
  } catch (err) {
    console.error('[Simulation Error]', err);
    alert('Simulation error: ' + err.message);
  } finally {
    if (loading) loading.classList.add('d-none');
  }
};

const triggerScenarioForPath = (pathwayId) => {
  const path = window.currentPathways.find(p => p.pathwayId === pathwayId);
  if (path && typeof setCurrentActivePathway === 'function') {
    setCurrentActivePathway(path);
  }

  // Switch to What-If Tab
  const whatIfTab = document.getElementById('pills-whatif-tab');
  if (whatIfTab) {
    const bsTab = new bootstrap.Tab(whatIfTab);
    bsTab.show();
  }
};

window.loadPersona = loadPersona;
window.triggerScenarioForPath = triggerScenarioForPath;
window.openPsychometricQuiz = () => typeof startPsychometricQuiz === 'function' && startPsychometricQuiz();
window.openSavedRoadmaps = () => typeof openSavedRoadmapsModal === 'function' && openSavedRoadmapsModal();

window.quickJudgeSimulate = async (personaKey) => {
  loadPersona(personaKey);
  const form = document.getElementById('intakeAssessmentForm');
  if (form) {
    const fakeEvent = { preventDefault: () => {} };
    await handleIntakeSubmit(fakeEvent);
  }
};

window.quickJudgeWhatIf = () => {
  const whatIfTab = document.getElementById('pills-whatif-tab');
  if (whatIfTab) {
    new bootstrap.Tab(whatIfTab).show();
    setTimeout(() => {
      const neetBtn = document.getElementById('preset_NEET_FAIL');
      if (neetBtn) neetBtn.click();
      else {
        const firstPreset = document.querySelector('.scenario-trigger-btn');
        if (firstPreset) firstPreset.click();
      }
    }, 200);
  }
};

// ==========================================================================
// Accessible System Settings & Theme Controller
// ==========================================================================
const SETTINGS_KEY = 'margdarshak_user_settings';

const getStoredSettings = () => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? JSON.parse(raw) : {
      theme: 'oled',
      voiceCounsel: true,
      scholarships: true,
      highContrast: false,
      reducedMotion: false
    };
  } catch (_) {
    return { theme: 'oled', voiceCounsel: true, scholarships: true, highContrast: false, reducedMotion: false };
  }
};

const saveStoredSettings = (settings) => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (_) {}
};

const applyStoredSettings = () => {
  const s = getStoredSettings();
  setAppTheme(s.theme, false);
  toggleHighContrast(s.highContrast, false);
  toggleReducedMotion(s.reducedMotion, false);
  
  const voiceSw = document.getElementById('settingVoiceSwitch');
  if (voiceSw) voiceSw.checked = s.voiceCounsel;
  const aidSw = document.getElementById('settingScholarshipSwitch');
  if (aidSw) aidSw.checked = s.scholarships;
  const hcSw = document.getElementById('settingHighContrastSwitch');
  if (hcSw) hcSw.checked = s.highContrast;
  const rmSw = document.getElementById('settingReducedMotionSwitch');
  if (rmSw) rmSw.checked = s.reducedMotion;
};

const openSettingsModal = () => {
  const modalEl = document.getElementById('settingsModal');
  if (modalEl) {
    if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
      const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
      modal.show();
    }
  }
};

const setAppTheme = (themeName, persist = true) => {
  document.body.classList.remove('theme-light', 'theme-cyber');
  ['themeCardOled', 'themeCardCyber', 'themeCardLight'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('active');
  });

  if (themeName === 'light') {
    document.body.classList.add('theme-light');
    const el = document.getElementById('themeCardLight');
    if (el) el.classList.add('active');
  } else if (themeName === 'cyber') {
    document.body.classList.add('theme-cyber');
    const el = document.getElementById('themeCardCyber');
    if (el) el.classList.add('active');
  } else {
    const el = document.getElementById('themeCardOled');
    if (el) el.classList.add('active');
  }

  if (persist) {
    const s = getStoredSettings();
    s.theme = themeName;
    saveStoredSettings(s);
  }
};

const toggleHighContrast = (enabled, persist = true) => {
  if (enabled) {
    document.body.classList.add('high-contrast-mode');
  } else {
    document.body.classList.remove('high-contrast-mode');
  }
  if (persist) {
    const s = getStoredSettings();
    s.highContrast = enabled;
    saveStoredSettings(s);
  }
};

const toggleReducedMotion = (enabled, persist = true) => {
  if (enabled) {
    document.body.classList.add('reduced-motion-mode');
  } else {
    document.body.classList.remove('reduced-motion-mode');
  }
  if (persist) {
    const s = getStoredSettings();
    s.reducedMotion = enabled;
    saveStoredSettings(s);
  }
};

const toggleVoiceCounsel = (enabled) => {
  const s = getStoredSettings();
  s.voiceCounsel = enabled;
  saveStoredSettings(s);
};

const toggleScholarshipAlerts = (enabled) => {
  const s = getStoredSettings();
  s.scholarships = enabled;
  saveStoredSettings(s);
};

window.openSettingsModal = openSettingsModal;
window.setAppTheme = setAppTheme;
window.toggleHighContrast = toggleHighContrast;
window.toggleReducedMotion = toggleReducedMotion;
window.toggleVoiceCounsel = toggleVoiceCounsel;
window.toggleScholarshipAlerts = toggleScholarshipAlerts;
