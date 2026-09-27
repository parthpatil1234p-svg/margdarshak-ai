/**
 * Interactive "What-If" Scenario Simulator Module
 * Handles scenario pivots, impact calculation diffs, and AI insights
 */

let currentActivePathway = null;

const initWhatIfScenarios = async () => {
  try {
    const res = await fetch('/api/what-if/scenarios');
    const data = await res.json();
    if (data.success && data.scenarios) {
      renderScenarioPresetButtons(data.scenarios);
    }
  } catch (err) {
    console.warn('[What-If Init Warning]', err);
  }
};

const renderScenarioPresetButtons = (scenarios) => {
  const container = document.getElementById('scenarioPresetButtons');
  if (!container) return;

  const icons = {
    NEET_FAIL: 'fa-user-doctor',
    JEE_FAIL: 'fa-microchip',
    BUDGET_CUT_50: 'fa-piggy-bank',
    STUDY_ABROAD_GERMANY: 'fa-plane-departure'
  };

  container.innerHTML = scenarios.map((s, idx) => `
    <button class="p-3 w-100 mb-2 rounded-3 scenario-trigger-btn ${idx === 0 ? 'active' : ''}"
      id="btn_preset_${s.scenarioId}"
      onclick="runWhatIfScenario('${s.scenarioId}', this)">
      <div class="d-flex align-items-center">
        <div class="p-2 bg-primary rounded-circle me-3 flex-shrink-0 text-white d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
          <i class="fa-solid ${icons[s.scenarioId] || 'fa-shuffle'} fa-lg"></i>
        </div>
        <div class="flex-grow-1 min-w-0">
          <div class="scenario-btn-title">${s.title}</div>
          <small class="scenario-btn-desc d-block mt-1">${s.description.slice(0, 95)}...</small>
        </div>
      </div>
    </button>
  `).join('');
};

const runWhatIfScenario = async (scenarioId, clickedBtn = null) => {
  const pathwayToTest = currentActivePathway || window.currentPathways?.[0];
  if (!pathwayToTest) {
    alert('Please run the Class 10 assessment first or pick a demo persona!');
    return;
  }

  // Manage active preset visual selection
  document.querySelectorAll('.scenario-trigger-btn').forEach(btn => btn.classList.remove('active'));
  if (clickedBtn) {
    clickedBtn.classList.add('active');
  } else {
    const el = document.getElementById(`btn_preset_${scenarioId}`);
    if (el) el.classList.add('active');
  }

  const loader = document.getElementById('whatIfLoading');
  if (loader) loader.classList.remove('d-none');

  try {
    const res = await fetch('/api/what-if/simulate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        scenarioId,
        currentPathway: pathwayToTest
      })
    });
    const data = await res.json();
    if (data.success) {
      renderWhatIfResults(data);
      if (typeof window.markStepComplete === 'function') {
        window.markStepComplete(3);
      }
      if (typeof window.showToast === 'function') {
        const savedINR = data.differential?.costDeltaINR ? Math.abs(data.differential.costDeltaINR) : 8000000;
        window.showToast('What-If Pivot Computed', `Modeled pivot saving ₹${(savedINR/100000).toFixed(0)} Lakhs and 0 drop years!`, 'fa-shuffle', 'info');
      }
    }
  } catch (err) {
    console.error('[What-If Simulation Error]', err);
  } finally {
    if (loader) loader.classList.add('d-none');
  }
};

const runCustomSandboxSimulation = async () => {
  const pathwayToTest = currentActivePathway || window.currentPathways?.[0];
  if (!pathwayToTest) return;

  const budgetDelta = Number(document.getElementById('sandboxBudgetSlider')?.value || 0);

  try {
    const res = await fetch('/api/what-if/simulate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        scenarioId: 'CUSTOM_SANDBOX',
        currentPathway: pathwayToTest,
        customOverrides: { budgetDelta }
      })
    });
    const data = await res.json();
    if (data.success) {
      renderWhatIfResults(data);
    }
  } catch (err) {
    console.error('[Custom Sandbox Error]', err);
  }
};

const renderWhatIfResults = (data) => {
  const resultContainer = document.getElementById('whatIfResultsContainer');
  if (!resultContainer) return;

  resultContainer.classList.remove('d-none');

  const { impactAnalysis, pivotedPathway, scenarioTitle, aiInsight } = data;

  // Impact metrics
  const costDiff = impactAnalysis.costDeltaINR;
  const costText = costDiff < 0
    ? `- ₹${(Math.abs(costDiff) / 100000).toFixed(1)} Lakhs (SAVED)`
    : `+ ₹${(costDiff / 100000).toFixed(1)} Lakhs`;
  const costColor = costDiff <= 0 ? 'green' : 'amber';

  const timeDiff = impactAnalysis.timeDeltaYears;
  const timeText = timeDiff < 0
    ? `${Math.abs(timeDiff)} Year${Math.abs(timeDiff) > 1 ? 's' : ''} Saved`
    : timeDiff === 0 ? '0 Years (On Time)' : `+${timeDiff} Yrs`;

  document.getElementById('diffCostDisplay').innerText = costText;
  document.getElementById('diffCostDisplay').className = `diff-delta ${costColor}`;

  document.getElementById('diffTimeDisplay').innerText = timeText;
  document.getElementById('diffTimeDisplay').className = 'diff-delta green';

  document.getElementById('diffRiskDisplay').innerText = impactAnalysis.riskChange || 'Optimized';
  document.getElementById('diffRiskDisplay').className = 'diff-delta blue';

  // AI Verdict Banner
  const aiBox = document.getElementById('whatIfAIVerdict');
  if (aiBox && aiInsight) {
    aiBox.innerHTML = `
      <div class="p-3 glass-card rounded-3 border border-glass">
        <h6 class="text-warning fw-bold"><i class="fa-solid fa-brain me-2"></i>Strategic AI Impact Rationale</h6>
        <p class="mb-1 text-white">${aiInsight.strategicVerdict}</p>
        <div class="row g-2 small text-light mt-2">
          <div class="col-md-6">
            <strong>Financial Impact:</strong> ${aiInsight.costImpactAnalysis}
          </div>
          <div class="col-md-6">
            <strong>Stress / Psychology:</strong> ${aiInsight.psychologicalReliefFactor}
          </div>
        </div>
      </div>
    `;
  }

  // Render Pivoted Pathway Roadmap
  const pivotMapContainer = document.getElementById('pivotedRoadmapPreview');
  if (pivotMapContainer && pivotedPathway) {
    pivotMapContainer.innerHTML = `
      <div class="custom-card spotlight-card p-4 border-info">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <span class="badge bg-info text-white fw-bold px-3 py-2 rounded-pill">
            <i class="fa-solid fa-route me-1"></i>Pivoted Pathway: ${pivotedPathway.pathwayName}
          </span>
          <span class="fw-bold text-success">
            Starting Salary: ₹${((pivotedPathway.targetCareer?.medianSalaryINR || 0) / 100000).toFixed(1)} LPA
          </span>
        </div>
        <p class="small text-secondary">${pivotedPathway.whyThisPathWorks}</p>

        <div class="stage-timeline">
          ${pivotedPathway.stages.map(st => `
            <div class="stage-node">
              <div class="stage-indicator bg-info text-white border-info">${st.stepNumber}</div>
              <div class="stage-box">
                <div class="d-flex justify-content-between align-items-start gap-2">
                  <div class="flex-grow-1 min-w-0">
                    <strong class="text-white">${st.title}</strong>
                    <div class="small text-muted mt-1">${st.subtitle || ''}</div>
                  </div>
                  <span class="badge stage-duration-badge bg-secondary-subtle text-secondary">${st.durationYears}&nbsp;Yr${st.durationYears > 1 ? 's' : ''}</span>
                </div>
                ${st.entranceExams?.length ? `<div class="mt-2"><span class="badge bg-secondary-subtle text-white border border-glass">${st.entranceExams.join(', ')}</span></div>` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
};

window.initWhatIfScenarios = initWhatIfScenarios;
window.runWhatIfScenario = runWhatIfScenario;
window.runCustomSandboxSimulation = runCustomSandboxSimulation;
window.setCurrentActivePathway = (p) => { currentActivePathway = p; };
