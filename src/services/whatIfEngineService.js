/**
 * What-If Scenario Simulator Service
 * Executes dynamic pivot analysis for presets and custom sandbox modifications.
 */

const scenariosData = require('../data/whatIfScenarios.json');
const { calculateEducationLoan } = require('./loanCalculatorService');
const { generateWhatIfAIInsight } = require('./aiReasoningService');

/**
 * Execute What-If simulation
 * @param {Object} params
 * @param {string} params.scenarioId - e.g., 'NEET_FAIL', 'JEE_FAIL', 'BUDGET_CUT_50', 'STUDY_ABROAD_GERMANY'
 * @param {Object} params.currentPathway - The currently active pathway object
 * @param {Object} [params.customOverrides] - Sliders or custom inputs
 */
const simulateWhatIf = async ({ scenarioId, currentPathway, customOverrides = {} }) => {
  const scenarioDef = scenariosData.find(s => s.scenarioId === scenarioId);

  // If built-in scenario preset found
  if (scenarioDef && scenarioDef.pivotOptions && scenarioDef.pivotOptions.length > 0) {
    const selectedOption = scenarioDef.pivotOptions[0]; // Primary recommended pivot
    const originalCost = currentPathway?.financialSummary?.totalCostINR || 1400000;
    const newCost = selectedOption.totalCostINR;
    const costDelta = newCost - originalCost;

    const originalSalary = currentPathway?.targetCareer?.medianSalaryINR || 1000000;
    const newSalary = selectedOption.medianSalaryINR;
    const salaryDelta = newSalary - originalSalary;

    const loanInfo = calculateEducationLoan({
      totalEducationCostINR: newCost,
      familyContributionINR: customOverrides.newBudget || 400000,
      scholarshipINR: 100000,
      annualInterestRate: 9.0,
      tenureYears: 5,
      medianStartingSalaryINR: newSalary
    });

    const pivotedPathway = {
      pathwayId: `PIVOT_${scenarioId}`,
      pathwayName: selectedOption.pathwayName,
      tag: 'WHAT_IF_PIVOT',
      badgeText: 'What-If Pivoted Path',
      badgeColor: 'info',
      streamCode: currentPathway?.streamCode || 'STREAM_PCM',
      targetCareer: {
        role: selectedOption.targetCareer,
        medianSalaryINR: newSalary,
        fiveYearSalaryINR: newSalary * 2.2,
        growthOutlook: 'Rapid (+20% YoY)'
      },
      stages: [
        {
          stepNumber: 1,
          stageType: 'CLASS_10',
          title: 'Class 10 Transition & Strategy Pivot',
          subtitle: 'Re-evaluating target pathway without sunk cost fallacy',
          durationYears: 1,
          estimatedCostINR: 30000,
          entranceExams: ['Class 10 Board Exam'],
          keyMilestones: ['Pivot decision locked', 'Mental clarity achieved'],
          difficultyIndex: 'Low'
        },
        {
          stepNumber: 2,
          stageType: 'STREAM_11_12',
          title: 'Class 11 & 12 Specialized Track',
          subtitle: 'Focusing on relevant entrance exams without unnecessary stress',
          durationYears: 2,
          estimatedCostINR: 100000,
          entranceExams: [selectedOption.entranceReq],
          keyMilestones: ['Strong board percentage', 'Targeted state/university exam prep'],
          difficultyIndex: 'Moderate'
        },
        {
          stepNumber: 3,
          stageType: 'ENTRANCE_UG',
          title: `Undergraduate Degree: ${selectedOption.newStreamOrDegree}`,
          subtitle: 'Direct admission without drop year delays',
          durationYears: selectedOption.durationYears,
          estimatedCostINR: newCost - 130000,
          entranceExams: [selectedOption.entranceReq],
          keyMilestones: ['Hands-on laboratory/software projects', 'Industry certifications', 'Internships'],
          difficultyIndex: 'Moderate'
        },
        {
          stepNumber: 4,
          stageType: 'CAREER_ENTRY',
          title: `Direct Placement: ${selectedOption.targetCareer}`,
          subtitle: `Starting at ₹${(newSalary / 100000).toFixed(1)} LPA`,
          durationYears: 1,
          estimatedCostINR: 0,
          entranceExams: [],
          keyMilestones: ['Immediate earning start', 'Zero to minimal debt burden'],
          difficultyIndex: 'Low'
        }
      ],
      financialSummary: {
        totalCostINR: newCost,
        estimatedScholarshipINR: 100000,
        netCostToFamilyINR: Math.max(0, newCost - 100000),
        loanPrincipalNeededINR: loanInfo.principalLoanINR,
        monthlyEMI: loanInfo.monthlyEMI,
        loanPaybackYears: loanInfo.paybackYears,
        borrowingRiskLevel: loanInfo.riskCategory
      },
      yearsToEarning: 2 + selectedOption.durationYears,
      competitiveRisk: 'Low to Moderate',
      aiConfidenceScore: 92,
      assumptionsAndCaveats: [
        'Eliminates need for expensive repeat coaching years (saving ₹2-4 Lakhs and 1-2 years).',
        'Direct admission pathway with significantly higher seat-to-applicant ratios.',
        selectedOption.rationale
      ],
      whyThisPathWorks: selectedOption.rationale
    };

    const aiInsight = await generateWhatIfAIInsight(scenarioDef.title, currentPathway || {}, pivotedPathway);

    return {
      scenarioId,
      scenarioTitle: scenarioDef.title,
      triggerDescription: scenarioDef.description,
      impactAnalysis: {
        costDeltaINR: costDelta,
        timeDeltaYears: selectedOption.yearsSaved ? -selectedOption.yearsSaved : 0,
        riskChange: selectedOption.riskChange,
        startingSalaryDeltaINR: salaryDelta,
        loanEMIDeltaINR: loanInfo.monthlyEMI - (currentPathway?.financialSummary?.monthlyEMI || 0),
        paybackTimeChangeYears: loanInfo.paybackYears - (currentPathway?.financialSummary?.loanPaybackYears || 0)
      },
      pivotedPathway,
      allAvailableOptions: scenarioDef.pivotOptions,
      aiInsight
    };
  }

  // Custom Sandbox Simulation
  const budgetDelta = customOverrides.budgetDelta || 0;
  const originalCost = currentPathway?.financialSummary?.totalCostINR || 1000000;
  const newBudget = Math.max(100000, (currentPathway?.financialSummary?.netCostToFamilyINR || 500000) + budgetDelta);
  const salary = currentPathway?.targetCareer?.medianSalaryINR || 900000;

  const loanInfo = calculateEducationLoan({
    totalEducationCostINR: originalCost,
    familyContributionINR: newBudget,
    scholarshipINR: 100000,
    annualInterestRate: 9.2,
    tenureYears: 5,
    medianStartingSalaryINR: salary
  });

  return {
    scenarioId: 'CUSTOM_SANDBOX',
    scenarioTitle: 'Custom Sandbox Parameter Shift',
    triggerDescription: `User adjusted financial and preference parameters (Budget Delta: ₹${budgetDelta.toLocaleString('en-IN')}).`,
    impactAnalysis: {
      costDeltaINR: 0,
      timeDeltaYears: 0,
      riskChange: loanInfo.riskCategory,
      startingSalaryDeltaINR: 0,
      loanEMIDeltaINR: loanInfo.monthlyEMI - (currentPathway?.financialSummary?.monthlyEMI || 0),
      paybackTimeChangeYears: loanInfo.paybackYears - (currentPathway?.financialSummary?.loanPaybackYears || 0)
    },
    pivotedPathway: {
      ...currentPathway,
      pathwayId: 'PIVOT_CUSTOM',
      financialSummary: {
        ...currentPathway?.financialSummary,
        loanPrincipalNeededINR: loanInfo.principalLoanINR,
        monthlyEMI: loanInfo.monthlyEMI,
        loanPaybackYears: loanInfo.paybackYears,
        borrowingRiskLevel: loanInfo.riskCategory
      }
    },
    aiInsight: {
      strategicVerdict: 'Sandbox Parameters Updated Successfully.',
      costImpactAnalysis: `Adjusted family budget directly modified loan requirement to ₹${loanInfo.principalLoanINR.toLocaleString('en-IN')}.`,
      careerTrajectoryImpact: 'Core educational path preserved with updated debt obligations.',
      psychologicalReliefFactor: loanInfo.principalLoanINR === 0 ? 'Completely debt-free pathway.' : 'Manageable scheduled loan payments.',
      recommendedNextSteps: ['Review updated EMI in the loan calculator tab.'],
      source: 'MargDarshak Sandbox Engine'
    }
  };
};

module.exports = { simulateWhatIf };
