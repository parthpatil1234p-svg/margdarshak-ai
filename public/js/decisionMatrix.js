/**
 * Explainable Decision Matrix Module
 * Generates side-by-side multi-pathway comparative matrix & printable dossier
 */

const renderDecisionMatrix = async (pathways) => {
  const container = document.getElementById('decisionMatrixContainer');
  if (!container) return;

  const pathwaysToCompare = pathways || window.currentPathways;
  if (!pathwaysToCompare || pathwaysToCompare.length === 0) {
    container.innerHTML = `
      <div class="p-4 text-center glass-card rounded-3 border border-glass">
        <p class="text-muted mb-0">Please simulate pathways first to view the explainable decision matrix.</p>
      </div>
    `;
    return;
  }

  try {
    const res = await fetch('/api/matrix/compare', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pathways: pathwaysToCompare })
    });
    const data = await res.json();
    if (data.success) {
      buildMatrixTable(data.headers, data.matrix);
    }
  } catch (err) {
    console.error('[Decision Matrix Error]', err);
  }
};

const buildMatrixTable = (headers, matrixRows) => {
  const container = document.getElementById('decisionMatrixContainer');
  if (!container) return;

  let tableHtml = `
    <div class="table-responsive">
      <table class="matrix-table shadow-sm">
        <thead>
          <tr>
            <th style="width: 25%;">Evaluation Metric</th>
            ${headers.map(h => `
              <th style="width: 25%; text-align: center;">
                <span class="badge bg-${h.badgeColor || 'primary'} mb-1">${h.badgeText}</span>
                <div class="fw-bold">${h.name}</div>
              </th>
            `).join('')}
          </tr>
        </thead>
        <tbody>
  `;

  matrixRows.forEach(row => {
    tableHtml += `
      <tr>
        <td class="matrix-metric-title">
          <i class="fa-solid fa-check text-primary me-2"></i>${row.label}
        </td>
        ${row.values.map((val, idx) => {
          let isBest = false;
          // Highlight logic
          if (row.highlightBest === 'lowest') {
            const cleanVals = row.values.map(v => parseFloat(v.replace(/[^0-9.]/g, '')) || 0);
            const minVal = Math.min(...cleanVals);
            const currentClean = parseFloat(val.replace(/[^0-9.]/g, '')) || 0;
            if (currentClean === minVal && cleanVals.filter(x => x === minVal).length === 1) isBest = true;
          } else if (row.highlightBest === 'highest') {
            const cleanVals = row.values.map(v => parseFloat(v.replace(/[^0-9.]/g, '')) || 0);
            const maxVal = Math.max(...cleanVals);
            const currentClean = parseFloat(val.replace(/[^0-9.]/g, '')) || 0;
            if (currentClean === maxVal && cleanVals.filter(x => x === maxVal).length === 1) isBest = true;
          }

          return `
            <td class="text-center ${isBest ? 'best-cell' : ''}">
              ${isBest ? '<i class="fa-solid fa-star text-warning me-1"></i>' : ''}${val}
            </td>
          `;
        }).join('')}
      </tr>
    `;
  });

  tableHtml += `
        </tbody>
      </table>
    </div>
  `;

  container.innerHTML = tableHtml;
};

const printCareerDossier = () => {
  window.print();
};

const downloadOfficialPDFDossier = () => {
  const profile = window.currentStudentProfile || { fullName: 'Student', marks: { overallPercentage: 78 } };
  const pathways = window.currentPathways || [];
  const counseling = window.counselingData || {};

  if (!pathways.length) {
    alert('Please simulate a pathway first before downloading the official dossier!');
    return;
  }

  // Create temporary off-screen container for PDF generation
  const pdfContainer = document.createElement('div');
  pdfContainer.style.padding = '30px';
  pdfContainer.style.background = '#ffffff';
  pdfContainer.style.color = '#0f172a';
  pdfContainer.style.fontFamily = "'Inter', Arial, sans-serif";

  const primaryPath = pathways[0];
  const verId = 'MD-' + Math.random().toString(36).substring(2, 9).toUpperCase();

  pdfContainer.innerHTML = `
    <div style="border-bottom: 3px solid #4338ca; padding-bottom: 15px; margin-bottom: 20px;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h2 style="color: #4338ca; margin: 0; font-size: 24px; font-weight: 800;">MargDarshak AI (मार्गदर्शक AI)</h2>
          <div style="color: #64748b; font-size: 11px; margin-top: 4px;">Career Path Simulator: From Class 10 to Career | Track 04: Miscellaneous (MISC-01)</div>
          <div style="color: #64748b; font-size: 11px;">HackMatrix 5.0 (Kali Yuga) — Pimpri Chinchwad College of Engineering (PCCOE), Pune</div>
        </div>
        <div style="text-align: right;">
          <div style="background: #ecfdf5; color: #065f46; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; border: 1px solid #10b981;">
            VERIFIED REPORT: ${verId}
          </div>
          <div style="font-size: 10px; color: #94a3b8; margin-top: 4px;">Date: ${new Date().toLocaleDateString('en-IN')}</div>
        </div>
      </div>
    </div>

    <!-- Student Profile Strip -->
    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 16px; margin-bottom: 20px;">
      <h4 style="margin: 0 0 8px 0; font-size: 14px; color: #1e293b; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">Student Academic & Financial Profile</h4>
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; font-size: 11px;">
        <div><strong>Name:</strong> ${profile.fullName}</div>
        <div><strong>10th Score:</strong> ${profile.marks?.overallPercentage}%</div>
        <div><strong>Family Budget:</strong> ₹${((profile.maxBudgetINR || 600000) / 100000).toFixed(1)} Lakhs</div>
        <div><strong>Aspiration:</strong> ${profile.targetAspiration || 'Open'}</div>
      </div>
    </div>

    <!-- Top 3 Pathways Summary -->
    <h4 style="font-size: 14px; color: #1e293b; margin-bottom: 8px;">Multi-Pathway Comparative Analysis</h4>
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 10px; border: 1px solid #cbd5e1;">
      <thead>
        <tr style="background: #1e293b; color: white;">
          <th style="padding: 6px 8px; border: 1px solid #cbd5e1; text-align: left;">Pathway Route</th>
          <th style="padding: 6px 8px; border: 1px solid #cbd5e1; text-align: left;">Target Career</th>
          <th style="padding: 6px 8px; border: 1px solid #cbd5e1; text-align: center;">Total Cost</th>
          <th style="padding: 6px 8px; border: 1px solid #cbd5e1; text-align: center;">Loan Needed</th>
          <th style="padding: 6px 8px; border: 1px solid #cbd5e1; text-align: center;">Monthly EMI</th>
          <th style="padding: 6px 8px; border: 1px solid #cbd5e1; text-align: center;">Starting Package</th>
          <th style="padding: 6px 8px; border: 1px solid #cbd5e1; text-align: center;">Payback Horizon</th>
        </tr>
      </thead>
      <tbody>
        ${pathways.map((p, idx) => `
          <tr style="background: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
            <td style="padding: 6px 8px; border: 1px solid #cbd5e1; font-weight: bold;">${p.pathwayName}</td>
            <td style="padding: 6px 8px; border: 1px solid #cbd5e1;">${p.targetCareer?.role}</td>
            <td style="padding: 6px 8px; border: 1px solid #cbd5e1; text-align: center;">₹${((p.financialSummary?.totalCostINR || 0)/100000).toFixed(1)}L</td>
            <td style="padding: 6px 8px; border: 1px solid #cbd5e1; text-align: center; color: ${p.financialSummary?.loanPrincipalNeededINR > 0 ? '#b91c1c' : '#047857'}; font-weight: bold;">
              ${p.financialSummary?.loanPrincipalNeededINR > 0 ? `₹${((p.financialSummary.loanPrincipalNeededINR)/100000).toFixed(1)}L` : '₹0 (Debt-Free)'}
            </td>
            <td style="padding: 6px 8px; border: 1px solid #cbd5e1; text-align: center;">₹${(p.financialSummary?.monthlyEMI || 0).toLocaleString('en-IN')}/mo</td>
            <td style="padding: 6px 8px; border: 1px solid #cbd5e1; text-align: center; color: #047857; font-weight: bold;">₹${((p.targetCareer?.medianSalaryINR || 0)/100000).toFixed(1)} LPA</td>
            <td style="padding: 6px 8px; border: 1px solid #cbd5e1; text-align: center;">${p.financialSummary?.loanPaybackYears > 0 ? `${p.financialSummary.loanPaybackYears} Yrs` : '0 Yrs'}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <!-- Primary Pathway Milestones -->
    <div style="margin-bottom: 20px;">
      <h4 style="font-size: 14px; color: #1e293b; margin-bottom: 8px;">Sequential Milestone Progression: ${primaryPath.pathwayName}</h4>
      <div style="border-left: 2px solid #4338ca; padding-left: 12px; margin-left: 6px;">
        ${primaryPath.stages.map(st => `
          <div style="margin-bottom: 8px;">
            <div style="font-weight: bold; font-size: 11px; color: #1e1b4b;">Stage ${st.stepNumber}: ${st.title} (${st.durationYears} Yr)</div>
            <div style="font-size: 10px; color: #64748b;">${st.subtitle || ''} | Est. Cost: ₹${(st.estimatedCostINR || 0).toLocaleString('en-IN')}</div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- AI Counselor Summary -->
    <div style="background: #eef2ff; border: 1px solid #c7d2fe; border-radius: 8px; padding: 12px; margin-bottom: 20px; font-size: 11px;">
      <strong style="color: #3730a3;">MargDarshak AI Counseling Guidance:</strong>
      <p style="margin: 4px 0 0 0; color: #1e293b;">${counseling.executiveCounselorSummary || 'Aptitude-aligned strategic roadmap synthesized.'}</p>
      <div style="margin-top: 6px; color: #047857;"><strong>Parent Financial Tip:</strong> ${counseling.parentFinancialGuidance || 'Ensure debt obligations stay under 30% of entry salary.'}</div>
    </div>

    <!-- Official Validation Footer -->
    <div style="border-top: 1px solid #e2e8f0; padding-top: 10px; display: flex; justify-content: space-between; align-items: center; font-size: 9px; color: #94a3b8;">
      <div>
        Generated by <strong>MargDarshak AI</strong> | HackMatrix 5.0 (Kali Yuga) | PCCOE Pune<br>
        Aligned with UN SDG 4 (Quality Education) & SDG 8 (Decent Work) | AISHE & NEP 2020 Frameworks
      </div>
      <div style="text-align: right;">
        Status: <strong>DIGITALLY AUTHENTICATED</strong>
      </div>
    </div>
  `;

  const opt = {
    margin: 10,
    filename: `MargDarshak_Career_Dossier_${profile.fullName.replace(/\s+/g, '_')}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  if (typeof html2pdf !== 'undefined') {
    html2pdf().set(opt).from(pdfContainer).save();
  } else {
    // Fallback if library didn't load
    window.print();
  }
};

window.renderDecisionMatrix = renderDecisionMatrix;
window.printCareerDossier = printCareerDossier;
window.downloadOfficialPDFDossier = downloadOfficialPDFDossier;

