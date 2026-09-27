/**
 * MargDarshak AI - Advanced UX Enhancements Engine
 * Features:
 * 1. Global Command Palette (Ctrl+K / Cmd+K) with instant search across all features
 * 2. Interactive Workflow Stepper with dynamic progress tracking and next-step guides
 * 3. Non-intrusive Glassmorphic Toast Notification System
 * 4. Milestone Deep-Dive Inspection Drawer (NEP 2020 & Salary Curves)
 * 5. Subtle Acoustic / Sound Feedback via Web Audio API (Toggleable)
 */

(function() {
  'use strict';

  // State
  let soundEnabled = true;
  let activeStep = 1;
  const completedSteps = new Set([1]);

  // Audio Synth Synthesizer for subtle haptic feedback
  let audioCtx = null;
  function getAudioContext() {
    if (!audioCtx && (window.AudioContext || window.webkitAudioContext)) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
  }

  function playUiSound(type = 'click') {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.04);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.04);
      } else if (type === 'success') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(554.37, now + 0.08); // C#
        osc.frequency.setValueAtTime(659.25, now + 0.16); // E
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === 'pivot') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(520, now + 0.15);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      }
    } catch (_) {}
  }

  // =========================================================================
  // 1. Toast Notification Manager
  // =========================================================================
  function showToast(title, message, icon = 'fa-circle-info', type = 'primary', duration = 3500) {
    let container = document.getElementById('uxToastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'uxToastContainer';
      container.className = 'ux-toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `ux-toast-item toast-${type} glass-card`;
    toast.innerHTML = `
      <div class="toast-icon-box bg-${type}">
        <i class="fa-solid ${icon}"></i>
      </div>
      <div class="toast-text-content">
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
      </div>
      <button type="button" class="toast-close-btn" aria-label="Dismiss">&times;</button>
    `;

    container.appendChild(toast);
    playUiSound(type === 'success' ? 'success' : 'click');

    // Trigger enter animation
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    const closeToast = () => {
      toast.classList.remove('show');
      toast.classList.add('hide');
      setTimeout(() => toast.remove(), 300);
    };

    toast.querySelector('.toast-close-btn').addEventListener('click', closeToast);
    if (duration > 0) {
      setTimeout(closeToast, duration);
    }
  }

  // =========================================================================
  // 2. Interactive Workflow Stepper
  // =========================================================================
  const STEPS_DATA = [
    { id: 1, tabId: 'pills-intake-tab', name: 'Intake Profile', short: 'Intake', icon: 'fa-clipboard-question', nextPrompt: 'Simulate Career Pathways' },
    { id: 2, tabId: 'pills-roadmap-tab', name: 'Sequential Pathways', short: 'Pathways', icon: 'fa-route', nextPrompt: 'Test Stress-Test in What-If' },
    { id: 3, tabId: 'pills-whatif-tab', name: 'What-If Contingency', short: 'What-If', icon: 'fa-shuffle', nextPrompt: 'Calculate Loan & Aid' },
    { id: 4, tabId: 'pills-finance-tab', name: 'Loan ROI & Aid', short: 'Loan & Aid', icon: 'fa-calculator', nextPrompt: 'Export Decision Matrix' },
    { id: 5, tabId: 'pills-matrix-tab', name: 'Decision Dossier', short: 'Dossier', icon: 'fa-table-columns', nextPrompt: 'Download Official PDF' }
  ];

  function renderWorkflowStepper() {
    const targetSlot = document.getElementById('workflowStepperSlot');
    if (!targetSlot) return;

    let html = `
      <div class="workflow-stepper-wrapper mb-4">
        <div class="stepper-header d-flex align-items-center justify-content-between mb-2">
          <div class="d-flex align-items-center gap-2">
            <span class="stepper-badge"><i class="fa-solid fa-compass-drafting me-1 text-primary"></i>Decision Journey</span>
            <span class="stepper-progress-text small text-muted">Step <strong>${activeStep}</strong> of 5</span>
          </div>
          <div id="stepperNextRecommendation" class="stepper-next-pill cursor-pointer" onclick="advanceToNextStep()">
            <span class="next-pill-dot"></span>
            <span class="next-pill-text">${STEPS_DATA[activeStep - 1]?.nextPrompt || 'Next Step'}</span>
            <i class="fa-solid fa-arrow-right ms-1"></i>
          </div>
        </div>

        <div class="stepper-track">
    `;

    STEPS_DATA.forEach((step, index) => {
      const isCompleted = completedSteps.has(step.id);
      const isActive = activeStep === step.id;
      const statusClass = isActive ? 'active' : isCompleted ? 'completed' : 'pending';

      html += `
        <div class="stepper-step ${statusClass}" onclick="goToStep(${step.id})" title="${step.name}">
          <div class="step-circle">
            ${isCompleted && !isActive ? '<i class="fa-solid fa-check"></i>' : `<i class="fa-solid ${step.icon}"></i>`}
          </div>
          <span class="step-label">${step.short}</span>
        </div>
      `;

      if (index < STEPS_DATA.length - 1) {
        const lineClass = completedSteps.has(step.id + 1) || (isCompleted && activeStep > step.id) ? 'completed' : '';
        html += `<div class="stepper-line ${lineClass}"></div>`;
      }
    });

    html += `
        </div>
      </div>
    `;

    targetSlot.innerHTML = html;
  }

  function goToStep(stepNumber) {
    const step = STEPS_DATA.find(s => s.id === stepNumber);
    if (step) {
      activeStep = stepNumber;
      completedSteps.add(stepNumber);
      const tabEl = document.getElementById(step.tabId);
      if (tabEl) tabEl.click();
      renderWorkflowStepper();
      playUiSound('click');
    }
  }

  function advanceToNextStep() {
    if (activeStep < 5) {
      goToStep(activeStep + 1);
    } else {
      if (typeof window.downloadOfficialPDFDossier === 'function') {
        window.downloadOfficialPDFDossier();
      }
    }
  }

  function markStepComplete(stepNumber) {
    completedSteps.add(stepNumber);
    if (stepNumber < 5 && activeStep === stepNumber) {
      activeStep = stepNumber + 1;
      completedSteps.add(activeStep);
    }
    renderWorkflowStepper();
    playUiSound('success');
  }

  // =========================================================================
  // 3. Command Palette (Ctrl+K / ⌘K)
  // =========================================================================
  const COMMAND_ITEMS = [
    // Personas
    { category: 'Personas', title: 'Persona: Aarav Sharma', subtitle: 'Tech + Biology focus, average math, ₹6L budget', icon: 'fa-user', action: () => { window.loadPersona('PERSONA_A'); showToast('Persona Loaded', 'Loaded Aarav Sharma (Biotech & Software)', 'fa-user', 'info'); } },
    { category: 'Personas', title: 'Persona: Rajesh Patil', subtitle: 'Pragmatic middle-class parent, ₹4L budget, zero debt', icon: 'fa-users', action: () => { window.loadPersona('PERSONA_B'); showToast('Persona Loaded', 'Loaded Rajesh Patil (Applied Engineering)', 'fa-users', 'info'); } },
    { category: 'Personas', title: 'Persona: Ananya Sen', subtitle: 'High-aspirant, 94%+ marks, AI research & global study', icon: 'fa-rocket', action: () => { window.loadPersona('PERSONA_C'); showToast('Persona Loaded', 'Loaded Ananya Sen (AI & Pure Math)', 'fa-rocket', 'info'); } },

    // Core Workflows
    { category: 'Workflows', title: '1. Class 10 Intake Assessment', subtitle: 'Enter marks, interests, budget, and location preference', icon: 'fa-clipboard-question', action: () => goToStep(1) },
    { category: 'Workflows', title: '2. Sequential Career Pathways', subtitle: 'View Primary, Applied, and Cost-Optimized career roadmaps', icon: 'fa-route', action: () => goToStep(2) },
    { category: 'Workflows', title: '3. What-If Contingency Simulator', subtitle: 'Simulate NEET/JEE misses, family shocks, and immediate pivots', icon: 'fa-shuffle', action: () => goToStep(3) },
    { category: 'Workflows', title: '4. Loan EMI & Scholarships Matcher', subtitle: 'Calculate DTI risk, repayment schedule, and MahaDBT schemes', icon: 'fa-calculator', action: () => goToStep(4) },
    { category: 'Workflows', title: '5. Decision Matrix & PDF Dossier', subtitle: 'Compare trade-offs and export official branded career dossier', icon: 'fa-table-columns', action: () => goToStep(5) },

    // Interactive Tools
    { category: 'Tools', title: 'Psychometric RIASEC Aptitude Quiz', subtitle: 'Take 2-minute scientific test with Holland code profiling', icon: 'fa-brain', action: () => { if (typeof window.startPsychometricQuiz === 'function') window.startPsychometricQuiz(); } },
    { category: 'Tools', title: 'AI Career Counselor (Voice & Text)', subtitle: 'Chat with multilingual AI mentor in Marathi, Hindi, or English', icon: 'fa-robot', action: () => { if (typeof window.toggleChatWindow === 'function') window.toggleChatWindow(); } },
    { category: 'Tools', title: 'Saved Career Roadmaps', subtitle: 'Browse MongoDB-persisted career simulations', icon: 'fa-folder-open', action: () => { if (typeof window.openSavedRoadmapsModal === 'function') window.openSavedRoadmapsModal(); } },
    { category: 'Tools', title: 'Download Official PDF Dossier', subtitle: 'Generate verifiable career roadmap dossier PDF', icon: 'fa-file-pdf', action: () => { if (typeof window.downloadOfficialPDFDossier === 'function') window.downloadOfficialPDFDossier(); } },

    // What-If Presets
    { category: 'What-If Presets', title: 'Missed NEET Cutoff Pivot', subtitle: 'Simulate immediate ₹80L savings & 2 years saved via Bioinformatics', icon: 'fa-stethoscope', action: () => { goToStep(3); setTimeout(() => { const btn = document.getElementById('presetMissedNEET'); if (btn) btn.click(); }, 300); } },
    { category: 'What-If Presets', title: 'Missed JEE Advanced Pivot', subtitle: 'Fast-track through Autonomous Engineering / Polytechnic', icon: 'fa-laptop-code', action: () => { goToStep(3); setTimeout(() => { const btn = document.getElementById('presetMissedJEE'); if (btn) btn.click(); }, 300); } },
    { category: 'What-If Presets', title: 'Budget Cut 50% Contingency', subtitle: 'Evaluate zero-tuition Public Universities & Germany Model', icon: 'fa-piggy-bank', action: () => { goToStep(3); setTimeout(() => { const btn = document.getElementById('presetBudgetCut'); if (btn) btn.click(); }, 300); } },

    // Preferences & Themes
    { category: 'Preferences', title: 'Switch to Dark OLED Theme', subtitle: 'Ultra-deep pure black background with vibrant glows', icon: 'fa-moon', action: () => { window.setAppTheme('oled'); showToast('Theme Updated', 'Switched to Dark OLED Theme', 'fa-moon', 'primary'); } },
    { category: 'Preferences', title: 'Switch to Cyber Glow Theme', subtitle: 'Cyan neon accents and futuristic holographic styling', icon: 'fa-wand-magic-sparkles', action: () => { window.setAppTheme('cyber'); showToast('Theme Updated', 'Switched to Cyber Glow Theme', 'fa-wand-magic-sparkles', 'info'); } },
    { category: 'Preferences', title: 'Switch to Clean Light Theme', subtitle: 'High contrast crisp day mode styling', icon: 'fa-sun', action: () => { window.setAppTheme('light'); showToast('Theme Updated', 'Switched to Clean Light Theme', 'fa-sun', 'warning'); } },
    { category: 'Preferences', title: 'Open System Preferences & Settings', subtitle: 'Configure theme, voice counselor, and accessibility', icon: 'fa-gear', action: () => { window.openSettingsModal(); } },

    // Languages
    { category: 'Language', title: 'Switch Language to English', subtitle: 'Set English (US/IN) as default', icon: 'fa-language', action: () => { window.setLanguage('en'); showToast('Language Changed', 'Interface switched to English', 'fa-language', 'info'); } },
    { category: 'Language', title: 'Switch Language to हिंदी (Hindi)', subtitle: 'संपूर्ण इंटरफ़ेस और परामर्श हिंदी में', icon: 'fa-language', action: () => { window.setLanguage('hi'); showToast('भाषा बदली गई', 'इंटरफ़ेस हिंदी में बदला गया', 'fa-language', 'info'); } },
    { category: 'Language', title: 'Switch Language to मराठी (Marathi)', subtitle: 'संपूर्ण इंटरफेस आणि समुपदेशन मराठीत', icon: 'fa-language', action: () => { window.setLanguage('mr'); showToast('भाषा बदलली', 'इंटरफेस मराठीत बदलला', 'fa-language', 'info'); } }
  ];

  let commandModalEl = null;
  let selectedIndex = 0;
  let filteredCommands = [...COMMAND_ITEMS];

  function createCommandPaletteModal() {
    if (document.getElementById('commandPaletteModal')) return;

    const modal = document.createElement('div');
    modal.id = 'commandPaletteModal';
    modal.className = 'command-palette-backdrop';
    modal.style.display = 'none';
    modal.innerHTML = `
      <div class="command-palette-dialog glass-card">
        <div class="command-input-container">
          <i class="fa-solid fa-magnifying-glass text-muted me-2"></i>
          <input type="text" id="commandPaletteInput" class="command-input" placeholder="Type a career, tool, persona, or shortcut..." autocomplete="off" />
          <kbd class="command-esc-kbd">ESC</kbd>
        </div>
        <div class="command-results-list" id="commandResultsList">
          <!-- Injected dynamically -->
        </div>
        <div class="command-palette-footer">
          <span><kbd>↑</kbd> <kbd>↓</kbd> to navigate</span>
          <span><kbd>↵</kbd> to select</span>
          <span><kbd>esc</kbd> to close</span>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    commandModalEl = modal;

    const input = modal.querySelector('#commandPaletteInput');
    input.addEventListener('input', (e) => {
      filterCommands(e.target.value);
    });

    input.addEventListener('keydown', handleCommandKeyNavigation);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeCommandPalette();
    });
  }

  function filterCommands(query) {
    const q = (query || '').toLowerCase().trim();
    if (!q) {
      filteredCommands = [...COMMAND_ITEMS];
    } else {
      filteredCommands = COMMAND_ITEMS.filter(item => 
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    }
    selectedIndex = 0;
    renderCommandResults();
  }

  function renderCommandResults() {
    const container = document.getElementById('commandResultsList');
    if (!container) return;

    if (filteredCommands.length === 0) {
      container.innerHTML = `
        <div class="command-empty-state text-center py-4 text-muted">
          <i class="fa-solid fa-ghost fa-2x mb-2 text-secondary"></i>
          <div>No matching commands or actions found.</div>
        </div>
      `;
      return;
    }

    let html = '';
    let currentCategory = '';

    filteredCommands.forEach((item, idx) => {
      if (item.category !== currentCategory) {
        currentCategory = item.category;
        html += `<div class="command-group-heading">${currentCategory}</div>`;
      }

      const isSelected = idx === selectedIndex;
      html += `
        <div class="command-item ${isSelected ? 'selected' : ''}" data-index="${idx}" onclick="executeCommandByIndex(${idx})">
          <div class="command-item-icon"><i class="fa-solid ${item.icon}"></i></div>
          <div class="command-item-content">
            <div class="command-item-title">${item.title}</div>
            <div class="command-item-subtitle">${item.subtitle}</div>
          </div>
          ${isSelected ? '<span class="command-item-enter"><i class="fa-solid fa-arrow-turn-down-left"></i></span>' : ''}
        </div>
      `;
    });

    container.innerHTML = html;

    // Scroll selected item into view
    const selectedEl = container.querySelector('.command-item.selected');
    if (selectedEl) selectedEl.scrollIntoView({ block: 'nearest' });
  }

  function handleCommandKeyNavigation(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedIndex = (selectedIndex + 1) % filteredCommands.length;
      renderCommandResults();
      playUiSound('click');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedIndex = (selectedIndex - 1 + filteredCommands.length) % filteredCommands.length;
      renderCommandResults();
      playUiSound('click');
    } else if (e.key === 'Enter') {
      e.preventDefault();
      executeCommandByIndex(selectedIndex);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      closeCommandPalette();
    }
  }

  function executeCommandByIndex(index) {
    const item = filteredCommands[index];
    if (item && typeof item.action === 'function') {
      closeCommandPalette();
      playUiSound('success');
      item.action();
    }
  }

  function openCommandPalette() {
    createCommandPaletteModal();
    if (commandModalEl) {
      commandModalEl.style.display = 'flex';
      const input = commandModalEl.querySelector('#commandPaletteInput');
      if (input) {
        input.value = '';
        input.focus();
      }
      filterCommands('');
      playUiSound('click');
    }
  }

  function closeCommandPalette() {
    if (commandModalEl) {
      commandModalEl.style.display = 'none';
    }
  }

  // =========================================================================
  // 4. Milestone Deep-Dive Inspection Drawer
  // =========================================================================
  function openMilestoneDrawer(milestoneData) {
    let drawer = document.getElementById('milestoneInspectionDrawer');
    if (!drawer) {
      drawer = document.createElement('div');
      drawer.id = 'milestoneInspectionDrawer';
      drawer.className = 'milestone-drawer glass-card';
      document.body.appendChild(drawer);
    }

    const data = milestoneData || {
      stage: 'Undergraduate Stage (Years 1-4)',
      title: 'B.Tech in Biotechnology & Genetic Computing',
      cost: '₹4,50,000 Total',
      duration: '4 Years',
      exams: ['MHT-CET (State Merit)', 'JEE Mains (Rank 35k-70k)'],
      skills: ['Computational Genomics', 'CRISPR Tools', 'Python & Biopython', 'Cell Culture Protocols'],
      salary: '₹6.5 LPA - ₹11.2 LPA',
      nepOptions: 'Exit with Diploma after Year 2, or B.Sc Degree after Year 3 under NEP 2020 Framework',
      burnoutRisk: 'Low (Practical-led labs, zero toxic drop cycle)'
    };

    drawer.innerHTML = `
      <div class="drawer-header d-flex align-items-center justify-content-between p-3 border-bottom border-glass">
        <div class="d-flex align-items-center gap-2">
          <div class="badge-icon-box bg-primary bg-opacity-25 text-primary p-2 rounded-3">
            <i class="fa-solid fa-compass-drafting fa-lg"></i>
          </div>
          <div>
            <span class="badge bg-primary bg-opacity-20 text-primary small">${data.stage || 'Academic Milestone'}</span>
            <h6 class="fw-bold text-light mb-0">${data.title || 'Milestone Breakdown'}</h6>
          </div>
        </div>
        <button type="button" class="btn-close btn-close-white" onclick="closeMilestoneDrawer()" aria-label="Close"></button>
      </div>

      <div class="drawer-body p-4">
        <!-- Key Metrics Cards -->
        <div class="row g-2 mb-3">
          <div class="col-6">
            <div class="p-2 rounded-3 bg-dark bg-opacity-50 border border-glass text-center">
              <small class="text-muted d-block">Estimated Investment</small>
              <strong class="text-success">${data.cost || '₹3.5L'}</strong>
            </div>
          </div>
          <div class="col-6">
            <div class="p-2 rounded-3 bg-dark bg-opacity-50 border border-glass text-center">
              <small class="text-muted d-block">Starting Salary</small>
              <strong class="text-cyan">${data.salary || '₹7.5 LPA'}</strong>
            </div>
          </div>
        </div>

        <!-- Required Entrance Exams -->
        <div class="mb-3">
          <label class="small fw-bold text-muted mb-1"><i class="fa-solid fa-file-pen text-warning me-1"></i>Key Entrance Exams</label>
          <div class="d-flex flex-wrap gap-1">
            ${(Array.isArray(data.exams) ? data.exams : [data.exams || 'Direct Merit / CET']).map(e => `<span class="badge bg-warning bg-opacity-15 text-warning border border-warning border-opacity-25">${e}</span>`).join('')}
          </div>
        </div>

        <!-- Industry Skills Acquired -->
        <div class="mb-3">
          <label class="small fw-bold text-muted mb-1"><i class="fa-solid fa-microchip text-info me-1"></i>High-Value Industry Skills</label>
          <div class="d-flex flex-wrap gap-1">
            ${(Array.isArray(data.skills) ? data.skills : [data.skills || 'Core Fundamentals']).map(s => `<span class="badge bg-info bg-opacity-15 text-info border border-info border-opacity-25">${s}</span>`).join('')}
          </div>
        </div>

        <!-- NEP 2020 Multi-Entry / Exit Flexibility -->
        <div class="p-3 rounded-3 bg-indigo bg-opacity-10 border border-indigo border-opacity-25 mb-3">
          <div class="small fw-bold text-indigo mb-1"><i class="fa-solid fa-graduation-cap me-1"></i>NEP 2020 Exit Flexibility</div>
          <div class="small text-light">${data.nepOptions || 'Multiple exit options: Certificate after 1 yr, Diploma after 2 yrs, Degree after 3/4 yrs.'}</div>
        </div>

        <!-- Contingency Defense -->
        <div class="p-3 rounded-3 bg-success bg-opacity-10 border border-success border-opacity-25">
          <div class="small fw-bold text-success mb-1"><i class="fa-solid fa-shield-check me-1"></i>Contingency & Burnout Protection</div>
          <div class="small text-light">${data.burnoutRisk || 'Industry-integrated curriculum avoids risky gap-year penalties.'}</div>
        </div>
      </div>
    `;

    drawer.classList.add('open');
    playUiSound('click');
  }

  function closeMilestoneDrawer() {
    const drawer = document.getElementById('milestoneInspectionDrawer');
    if (drawer) drawer.classList.remove('open');
  }

  // =========================================================================
  // Global Event Listeners & Hotkeys
  // =========================================================================
  document.addEventListener('keydown', (e) => {
    // Ctrl+K or Cmd+K
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openCommandPalette();
    }
  });

  // Attach milestone click handlers to pathway milestone badges
  document.addEventListener('click', (e) => {
    const milestoneCard = e.target.closest('.timeline-milestone-card, .pathway-node, .milestone-badge-inspect');
    if (milestoneCard) {
      const stage = milestoneCard.getAttribute('data-stage') || milestoneCard.querySelector('.milestone-stage')?.textContent;
      const title = milestoneCard.getAttribute('data-title') || milestoneCard.querySelector('.milestone-title')?.textContent;
      const cost = milestoneCard.getAttribute('data-cost') || milestoneCard.querySelector('.milestone-cost')?.textContent;
      const salary = milestoneCard.getAttribute('data-salary') || milestoneCard.querySelector('.milestone-salary')?.textContent;
      
      openMilestoneDrawer({ stage, title, cost, salary });
    }
  });

  // Initialize on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    createCommandPaletteModal();
    renderWorkflowStepper();
  });

  // Export to window
  window.showToast = showToast;
  window.openCommandPalette = openCommandPalette;
  window.closeCommandPalette = closeCommandPalette;
  window.executeCommandByIndex = executeCommandByIndex;
  window.renderWorkflowStepper = renderWorkflowStepper;
  window.goToStep = goToStep;
  window.advanceToNextStep = advanceToNextStep;
  window.markStepComplete = markStepComplete;
  window.openMilestoneDrawer = openMilestoneDrawer;
  window.closeMilestoneDrawer = closeMilestoneDrawer;
  window.playUiSound = playUiSound;
})();
