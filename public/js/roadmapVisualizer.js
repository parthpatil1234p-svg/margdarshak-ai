/**
 * Pathway Roadmap Visualizer Module
 * Renders interactive sequential multi-pathways from Class 10 to Career
 */

const renderPathways = (pathways, containerId = 'pathwaysContainer') => {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!pathways || pathways.length === 0) {
    container.innerHTML = `
      <div class="col-12 text-center py-5">
        <div class="p-4 glass-card rounded-4 border border-glass">
          <i class="fa-solid fa-compass fa-3x text-muted mb-3"></i>
          <h5>No simulation active yet</h5>
          <p class="text-secondary">Complete the Class 10 assessment or select a demo persona above to generate multi-pathway career maps.</p>
        </div>
      </div>
    `;
    return;
  }

  let html = '';

  pathways.forEach((pathway, idx) => {
    const cardClass = pathway.tag === 'PRIMARY_ASPIRANT' ? 'primary-aspirant' :
                      pathway.tag === 'APPLIED_INDUSTRY' ? 'applied-industry' :
                      pathway.tag === 'COST_OPTIMIZED' ? 'cost-optimized' : 'primary-aspirant';

    const stagesHtml = pathway.stages.map(stage => {
      const examBadge = stage.entranceExams && stage.entranceExams.length > 0
        ? `<div class="mt-2"><span class="badge bg-secondary-subtle text-white border border-glass"><i class="fa-solid fa-file-signature text-primary me-1"></i>${stage.entranceExams.join(', ')}</span></div>`
        : '';

      const milestonesHtml = stage.keyMilestones && stage.keyMilestones.length > 0
        ? `<ul class="small text-muted ps-3 mb-0 mt-2">
            ${stage.keyMilestones.map(m => `<li>${m}</li>`).join('')}
           </ul>`
        : '';

      return `
        <div class="stage-node">
          <div class="stage-indicator">${stage.stepNumber}</div>
          <div class="stage-box">
            <div class="d-flex justify-content-between align-items-start gap-2">
              <div class="flex-grow-1 min-w-0">
                <strong class="d-block text-white">${stage.title}</strong>
                <span class="small text-muted">${stage.subtitle || ''}</span>
              </div>
              <span class="badge stage-duration-badge bg-secondary-subtle text-secondary">${stage.durationYears}&nbsp;Yr${stage.durationYears > 1 ? 's' : ''}</span>
            </div>
            ${examBadge}
            ${milestonesHtml}
            <div class="d-flex justify-content-between align-items-center mt-2 pt-2 border-top small text-muted">
              <span><i class="fa-solid fa-indian-rupee-sign me-1"></i>Est. ₹${(stage.estimatedCostINR || 0).toLocaleString('en-IN')}</span>
              <span class="badge ${stage.difficultyIndex === 'Extreme' ? 'bg-danger' : stage.difficultyIndex === 'High' ? 'bg-warning text-white' : 'bg-info'} text-white">${stage.difficultyIndex} Difficulty</span>
            </div>
          </div>
        </div>
      `;
    }).join('');

    const loanInfo = pathway.financialSummary;

    html += `
      <div class="col-lg-4 mb-4">
        <div class="custom-card pathway-card spotlight-card ${cardClass} p-4">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="badge bg-${pathway.badgeColor || 'primary'} px-3 py-2 rounded-pill fw-bold">
              ${pathway.badgeText || pathway.pathwayName}
            </span>
            <span class="small text-muted fw-bold">
              <i class="fa-solid fa-shield-halved me-1 text-${pathway.competitiveRisk === 'Extreme' ? 'danger' : pathway.competitiveRisk === 'High' ? 'warning' : 'success'}"></i>
              ${pathway.competitiveRisk} Risk
            </span>
          </div>

          <h5 class="fw-bold mt-2 text-white">${pathway.pathwayName}</h5>
          <p class="small text-secondary mb-3">${pathway.whyThisPathWorks || ''}</p>

          <!-- Career Target Strip -->
          <div class="p-3 glass-card rounded-3 mb-3 border border-glass">
            <div class="small text-uppercase text-muted fw-bold mb-1">Target Career Entry</div>
            <div class="fw-bold text-white fs-6">${pathway.targetCareer?.role || 'Professional'}</div>
            <div class="d-flex justify-content-between mt-2 pt-2 border-top small">
              <span class="text-success fw-bold">
                <i class="fa-solid fa-arrow-trend-up me-1"></i>₹${((pathway.targetCareer?.medianSalaryINR || 0) / 100000).toFixed(1)} LPA
              </span>
              <span class="text-muted">
                <i class="fa-regular fa-clock me-1"></i>${pathway.yearsToEarning} Yrs to Earning
              </span>
            </div>
          </div>

          <!-- Financial Snapshot -->
          <div class="row g-2 mb-3 small">
            <div class="col-6">
              <div class="p-2 border border-glass rounded text-center glass-card">
                <span class="text-muted d-block small">Total Cost</span>
                <strong class="text-white">₹${((loanInfo?.totalCostINR || 0) / 100000).toFixed(1)} Lakhs</strong>
              </div>
            </div>
            <div class="col-6">
              <div class="p-2 border border-glass rounded text-center glass-card">
                <span class="text-muted d-block small">Loan Needed</span>
                <strong class="${loanInfo?.loanPrincipalNeededINR > 0 ? 'text-danger' : 'text-success'}">
                  ${loanInfo?.loanPrincipalNeededINR > 0 ? `₹${((loanInfo.loanPrincipalNeededINR) / 100000).toFixed(1)}L` : '₹0 (Debt-Free)'}
                </strong>
              </div>
            </div>
          </div>

          <!-- Sequential Timeline Tree -->
          <div class="stage-timeline flex-grow-1">
            ${stagesHtml}
          </div>

          <!-- Assumptions & Caveats Footer -->
          <div class="mt-4 pt-3 border-top">
            <div class="small text-muted">
              <strong><i class="fa-solid fa-circle-info me-1"></i>Key Caveat:</strong>
              ${pathway.assumptionsAndCaveats?.[0] || 'Standard admission criteria apply.'}
            </div>
            <button class="btn-interactive-pill w-100 mt-3 py-2" onclick="triggerScenarioForPath('${pathway.pathwayId}')">
              <i class="fa-solid fa-flask text-info me-2"></i>Simulate "What-If" On This Path
            </button>
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
};

const renderCounselorGuidance = (counseling, containerId = 'counselingCommentaryContainer') => {
  const container = document.getElementById(containerId);
  if (!container || !counseling) return;

  container.innerHTML = `
    <div class="custom-card p-4 mb-4 border-start border-4 border-primary">
      <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div class="d-flex align-items-center gap-2">
          <div class="bg-primary text-white p-2 rounded-circle flex-shrink-0">
            <i class="fa-solid fa-robot fa-lg"></i>
          </div>
          <div>
            <h5 class="mb-0 fw-bold text-white fs-6 fs-md-5">MargDarshak AI Counselor Evaluation</h5>
            <span class="badge bg-primary-subtle text-primary small" style="white-space: normal; text-align: left;">${counseling.source ? (counseling.source.length > 35 ? 'MargDarshak AI Intelligence Engine' : counseling.source) : 'MargDarshak AI Intelligence Engine'}</span>
          </div>
        </div>
        <div class="text-end ms-auto">
          <span class="small text-muted d-block">AI Confidence</span>
          <span class="fw-bold text-primary fs-5">${counseling.aiConfidenceScore || 90}%</span>
        </div>
      </div>

      <div class="row g-3">
        <div class="col-md-6">
          <div class="p-3 glass-card rounded-3 h-100 border border-glass">
            <h6 class="fw-bold text-white"><i class="fa-solid fa-user-graduate text-primary me-2"></i>Student Strengths & Aptitude</h6>
            <p class="small text-secondary mb-0">${counseling.executiveCounselorSummary}</p>
          </div>
        </div>
        <div class="col-md-6">
          <div class="p-3 glass-card rounded-3 h-100 border border-glass">
            <h6 class="fw-bold text-white"><i class="fa-solid fa-hand-holding-dollar text-success me-2"></i>Parent Financial Prudence</h6>
            <p class="small text-secondary mb-0">${counseling.parentFinancialGuidance}</p>
          </div>
        </div>
      </div>

      <div class="row g-3 mt-1">
        <div class="col-md-6">
          <div class="small">
            <strong class="text-danger"><i class="fa-solid fa-triangle-exclamation me-1"></i>Critical Blind Spots Identified:</strong>
            <ul class="text-secondary ps-3 mb-0 mt-1">
              ${(counseling.blindSpotsIdentified || []).map(b => `<li>${b}</li>`).join('')}
            </ul>
          </div>
        </div>
        <div class="col-md-6">
          <div class="small">
            <strong class="text-success"><i class="fa-solid fa-shield-check me-1"></i>Recommended Contingency Moves:</strong>
            <ul class="text-secondary ps-3 mb-0 mt-1">
              ${(counseling.contingencyRecommendations || []).map(c => `<li>${c}</li>`).join('')}
            </ul>
          </div>
        </div>
      </div>
    </div>
  `;
};

window.renderPathways = renderPathways;
window.renderCounselorGuidance = renderCounselorGuidance;
