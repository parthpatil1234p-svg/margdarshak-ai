/**
 * Explainable Decision Matrix Controller
 * Compares multi-pathway options side-by-side with transparent assumptions and metrics.
 */

const comparePathways = (req, res) => {
  try {
    const { pathways = [] } = req.body;

    if (!Array.isArray(pathways) || pathways.length === 0) {
      return res.status(400).json({ success: false, error: 'Pathways array is required for comparison.' });
    }

    const comparisonRows = [
      {
        metricKey: 'pathwayName',
        label: 'Pathway Strategic Approach',
        values: pathways.map(p => p.pathwayName)
      },
      {
        metricKey: 'targetCareer',
        label: 'Target Career Role',
        values: pathways.map(p => p.targetCareer?.role || 'Professional')
      },
      {
        metricKey: 'totalCost',
        label: 'Total Estimated Cost (INR)',
        values: pathways.map(p => `₹${(p.financialSummary?.totalCostINR || 0).toLocaleString('en-IN')}`),
        highlightBest: 'lowest'
      },
      {
        metricKey: 'loanNeeded',
        label: 'Estimated Loan Principal Needed',
        values: pathways.map(p => `₹${(p.financialSummary?.loanPrincipalNeededINR || 0).toLocaleString('en-IN')}`),
        highlightBest: 'lowest'
      },
      {
        metricKey: 'monthlyEMI',
        label: 'Monthly Loan EMI',
        values: pathways.map(p => `₹${(p.financialSummary?.monthlyEMI || 0).toLocaleString('en-IN')}/mo`),
        highlightBest: 'lowest'
      },
      {
        metricKey: 'yearsToEarning',
        label: 'Years from Class 10 to First Earning',
        values: pathways.map(p => `${p.yearsToEarning} Years`),
        highlightBest: 'lowest'
      },
      {
        metricKey: 'competitiveRisk',
        label: 'Competitive Entrance Exam Risk',
        values: pathways.map(p => p.competitiveRisk || 'Moderate'),
        highlightBest: 'lowest'
      },
      {
        metricKey: 'startingSalary',
        label: 'Median Starting Salary (Annual)',
        values: pathways.map(p => `₹${((p.targetCareer?.medianSalaryINR || 0) / 100000).toFixed(1)} LPA`),
        highlightBest: 'highest'
      },
      {
        metricKey: 'paybackYears',
        label: 'Realistic Loan Payback Time',
        values: pathways.map(p => p.financialSummary?.loanPaybackYears > 0 ? `${p.financialSummary?.loanPaybackYears} Years` : '0 (Debt-Free)'),
        highlightBest: 'lowest'
      },
      {
        metricKey: 'borrowingIndex',
        label: 'Borrowing Risk Index',
        values: pathways.map(p => p.financialSummary?.borrowingRiskLevel || 'Moderate')
      },
      {
        metricKey: 'roiMultiplier',
        label: '5-Year Cumulative Salary / Cost Ratio',
        values: pathways.map(p => {
          const fiveYrTotal = (p.targetCareer?.medianSalaryINR || 800000) * 1.5 * 5;
          const cost = Math.max(1, p.financialSummary?.totalCostINR || 1000000);
          return `${(fiveYrTotal / cost).toFixed(1)}x ROI`;
        }),
        highlightBest: 'highest'
      },
      {
        metricKey: 'aiConfidence',
        label: 'AI Recommendation Confidence',
        values: pathways.map(p => `${p.aiConfidenceScore || 85}%`),
        highlightBest: 'highest'
      },
      {
        metricKey: 'assumptions',
        label: 'Key Transparent Assumptions & Caveats',
        values: pathways.map(p => p.assumptionsAndCaveats?.slice(0, 2).join('; ') || 'Standard progression rates applied.')
      }
    ];

    return res.status(200).json({
      success: true,
      pathwayCount: pathways.length,
      headers: pathways.map(p => ({
        id: p.pathwayId,
        name: p.pathwayName,
        tag: p.tag,
        badgeText: p.badgeText || p.pathwayName,
        badgeColor: p.badgeColor || 'primary'
      })),
      matrix: comparisonRows
    });
  } catch (err) {
    console.error('[Matrix Controller Error]', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { comparePathways };
