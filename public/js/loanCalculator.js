/**
 * Financial Feasibility & Education Loan ROI Engine Module
 * Computes exact loan parameters, visualizes debt risk meter, and queries scholarships
 */

let loanChart = null;

const initLoanCalculator = () => {
  const inputs = ['loanTotalCost', 'loanFamilySavings', 'loanScholarship', 'loanInterestRate', 'loanTenure', 'loanSalary'];
  inputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', updateLoanCalculations);
    }
  });

  updateLoanCalculations();
  fetchAndRenderScholarships();
};

const updateLoanCalculations = async () => {
  const totalCost = Number(document.getElementById('loanTotalCost')?.value || 1200000);
  const familySavings = Number(document.getElementById('loanFamilySavings')?.value || 400000);
  const scholarship = Number(document.getElementById('loanScholarship')?.value || 100000);
  const interestRate = Number(document.getElementById('loanInterestRate')?.value || 9.5);
  const tenure = Number(document.getElementById('loanTenure')?.value || 7);
  const salary = Number(document.getElementById('loanSalary')?.value || 1000000);

  // Update slider label texts
  document.getElementById('valTotalCost').innerText = `₹${(totalCost / 100000).toFixed(1)} L`;
  document.getElementById('valFamilySavings').innerText = `₹${(familySavings / 100000).toFixed(1)} L`;
  document.getElementById('valScholarship').innerText = `₹${(scholarship / 100000).toFixed(1)} L`;
  document.getElementById('valInterestRate').innerText = `${interestRate}%`;
  document.getElementById('valTenure').innerText = `${tenure} Yrs`;
  document.getElementById('valSalary').innerText = `₹${(salary / 100000).toFixed(1)} LPA`;

  try {
    const res = await fetch('/api/finance/calculate-loan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        totalEducationCostINR: totalCost,
        familyContributionINR: familySavings,
        scholarshipINR: scholarship,
        annualInterestRate: interestRate,
        tenureYears: tenure,
        medianStartingSalaryINR: salary
      })
    });
    const data = await res.json();
    if (data.success) {
      renderLoanUI(data.calculation);
    }
  } catch (err) {
    console.error('[Loan Calc Error]', err);
  }
};

const renderLoanUI = (calc) => {
  document.getElementById('resLoanPrincipal').innerText = `₹${calc.principalLoanINR.toLocaleString('en-IN')}`;
  document.getElementById('resMonthlyEMI').innerText = `₹${calc.monthlyEMI.toLocaleString('en-IN')}/mo`;
  document.getElementById('resTotalInterest').innerText = `₹${calc.totalInterestINR.toLocaleString('en-IN')}`;
  document.getElementById('resTotalPayment').innerText = `₹${calc.totalPaymentINR.toLocaleString('en-IN')}`;
  document.getElementById('resDTI').innerText = `${calc.debtToIncomeRatioPercent}%`;
  document.getElementById('resPaybackYears').innerText = calc.paybackYears > 0 ? `${calc.paybackYears} Years` : '0 (Debt-Free)';
  document.getElementById('resRiskBadge').innerText = calc.riskCategory;
  document.getElementById('resLoanGuidance').innerText = calc.recommendation;

  // Meter color and fill
  const meterFill = document.getElementById('borrowingMeterFill');
  const riskScore = calc.borrowingIndexScore || 70;
  meterFill.style.width = `${riskScore}%`;

  if (riskScore >= 80) {
    meterFill.style.backgroundColor = '#10b981'; // Green
    document.getElementById('resRiskBadge').className = 'badge bg-success px-3 py-2 fs-6';
  } else if (riskScore >= 60) {
    meterFill.style.backgroundColor = '#f59e0b'; // Amber
    document.getElementById('resRiskBadge').className = 'badge bg-warning text-white px-3 py-2 fs-6';
  } else {
    meterFill.style.backgroundColor = '#ef4444'; // Red
    document.getElementById('resRiskBadge').className = 'badge bg-danger px-3 py-2 fs-6';
  }

  // Render Doughnut Chart
  renderLoanDoughnutChart(calc.principalLoanINR, calc.totalInterestINR);
};

const renderLoanDoughnutChart = (principal, interest) => {
  const ctx = document.getElementById('loanDoughnutChart')?.getContext('2d');
  if (!ctx || typeof Chart === 'undefined') return;

  if (loanChart) {
    loanChart.destroy();
  }

  loanChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Principal Loan', 'Total Interest Paid'],
      datasets: [{
        data: [principal, interest],
        backgroundColor: ['#4338ca', '#f59e0b'],
        borderWidth: 2,
        borderColor: '#ffffff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom' }
      }
    }
  });
};

const fetchAndRenderScholarships = async () => {
  const container = document.getElementById('scholarshipsListContainer');
  if (!container) return;

  try {
    const marks = window.currentStudentProfile?.marks?.overallPercentage || 82;
    const income = window.currentStudentProfile?.maxBudgetINR || 600000;
    const res = await fetch(`/api/scholarships/match?marks=${marks}&familyIncomeINR=${income}`);
    const data = await res.json();

    if (data.success && data.scholarships) {
      container.innerHTML = data.scholarships.map(s => `
        <div class="col-md-6 mb-3">
          <div class="p-3 border border-glass rounded-3 h-100 glass-card shadow-sm ${s.isEligible ? 'border-success' : 'border-secondary opacity-75'}">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <span class="badge ${s.isEligible ? 'bg-success' : 'bg-secondary'}">
                ${s.isEligible ? 'Eligible to Apply' : 'Eligibility Check'}
              </span>
              <span class="fw-bold text-success small">
                ₹${(s.benefitAmountPerYearINR || 0).toLocaleString('en-IN')}/yr
              </span>
            </div>
            <h6 class="fw-bold text-white mb-1">${s.name}</h6>
            <div class="small text-muted mb-2">Provider: ${s.provider} | Portal: <strong>${s.portal}</strong></div>
            <p class="small text-secondary mb-2">${s.description}</p>
            ${s.disqualificationReasons?.length ? `<div class="small text-danger"><i class="fa-solid fa-circle-exclamation me-1"></i>${s.disqualificationReasons[0]}</div>` : ''}
          </div>
        </div>
      `).join('');
    }
  } catch (err) {
    console.warn('[Scholarship fetch warning]', err);
  }
};

window.initLoanCalculator = initLoanCalculator;
window.updateLoanCalculations = updateLoanCalculations;
window.fetchAndRenderScholarships = fetchAndRenderScholarships;
