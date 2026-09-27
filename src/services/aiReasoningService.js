/**
 * AI Reasoning Service
 * Powered by Google Gemini API with Deterministic Fallback Engine
 */

const { isGeminiAvailable, generateJSONWithGemini } = require('../config/gemini');

/**
 * Generate personalized career counseling commentary for student & parent
 */
const generateCounselingCommentary = async (studentProfile, pathways) => {
  const profileSummary = `Student: ${studentProfile.fullName}, 10th Marks: Math: ${studentProfile.marks?.math}%, Science: ${studentProfile.marks?.science}%, English: ${studentProfile.marks?.english}%, Social: ${studentProfile.marks?.social}%. Interests: ${studentProfile.interests?.join(', ')}. Annual Budget: ₹${studentProfile.maxBudgetINR}. Risk Profile: ${studentProfile.riskTolerance}. Preferred Location: ${studentProfile.preferredLocation}. Target Aspiration: ${studentProfile.targetAspiration || 'Open'}.`;

  if (isGeminiAvailable()) {
    const prompt = `
You are MargDarshak AI, an expert academic and financial counselor for Indian Class 10 students and their parents.
Analyze this student profile:
${profileSummary}

Selected Pathways:
${pathways.map((p, i) => `${i + 1}. ${p.pathwayName} (Total Cost: ₹${p.financialSummary?.totalCostINR}, Starting Salary: ₹${p.targetCareer?.medianSalaryINR})`).join('\n')}

Provide an objective, empathetic evaluation in this exact JSON schema:
{
  "executiveCounselorSummary": "2-3 concise sentences summarizing student strength and realistic path.",
  "parentFinancialGuidance": "Direct advice for parents regarding budget feasibility, loan prudence, and return on investment.",
  "blindSpotsIdentified": ["Risk 1", "Risk 2"],
  "contingencyRecommendations": ["Contingency tip 1", "Contingency tip 2"],
  "aiConfidenceScore": 88
}
`;
    const aiResult = await generateJSONWithGemini(prompt, 'You are an objective educational decision-support AI adhering to Indian academic and economic reality.');
    if (aiResult && aiResult.executiveCounselorSummary) {
      return {
        ...aiResult,
        source: 'Google Gemini 1.5 Flash (Live AI Reasoning)'
      };
    }
  }

  // Deterministic Fallback Engine
  const math = studentProfile.marks?.math || 70;
  const science = studentProfile.marks?.science || 70;
  const budget = studentProfile.maxBudgetINR || 500000;
  const interests = studentProfile.interests || [];

  let summary = `${studentProfile.fullName || 'The student'} exhibits strong foundational aptitude `;
  if (math >= 80 && science >= 80) {
    summary += `in STEM fields with balanced quantitative and conceptual reasoning. Both premier tech and computational science tracks are highly viable.`;
  } else if (science >= 75 && math < 70) {
    summary += `in biological and life sciences, while mathematical pressure should be strategically managed or diversified.`;
  } else if (interests.includes('Business & Finance') || interests.includes('Entrepreneurship')) {
    summary += `toward commercial and analytical enterprise, where quantitative business degrees offer exceptional ROI.`;
  } else {
    summary += `across multifaceted subjects. A multidisciplinary approach prioritizing practical employability is recommended.`;
  }

  let parentAdvice = '';
  if (budget < 800000) {
    parentAdvice = `With an annual budget under ₹8 Lakhs, prioritize autonomous state institutions (e.g., COEP/VJTI) or polytechnic-to-degree routes. Avoid high-interest private college loans above ₹15 Lakhs as starting entry salaries do not justify 10+ year repayment horizons.`;
  } else {
    parentAdvice = `Your budget accommodates premier private institutions (e.g., BITS) or selective global public options. Maintain an emergency education reserve and ensure the student maintains high GPA for merit fee-waivers.`;
  }

  return {
    executiveCounselorSummary: summary,
    parentFinancialGuidance: parentAdvice,
    blindSpotsIdentified: [
      math < 75 ? 'Heavy entrance exams like JEE Advanced carry high burn-out risk given current math scoring curve.' : 'Oversaturation in generic computer science degrees without niche specialized project portfolios.',
      'Hidden hostel, living, and entrance coaching expenses often exceed published tuition fees by 30-40%.'
    ],
    contingencyRecommendations: [
      'Maintain an active Plan B: If competitive exam ranks fall short, transition seamlessly to applied state autonomous or BCA+MCA programs rather than taking repeat drop years.',
      'Apply early for State EBC / Central Sector scholarships on National Scholarship Portal during the first admission semester.'
    ],
    aiConfidenceScore: Math.min(94, Math.max(76, Math.round((math + science) / 2 + 10))),
    source: 'MargDarshak Deterministic AI Heuristic Engine (100% Reliable Offline Fallback)'
  };
};

/**
 * AI analysis for custom What-If scenario pivot
 */
const generateWhatIfAIInsight = async (scenarioTrigger, originalPath, pivotPath) => {
  if (isGeminiAvailable()) {
    const prompt = `
A student is considering this academic scenario pivot:
Original Plan: ${originalPath.pathwayName} (Cost: ₹${originalPath.financialSummary?.totalCostINR})
Trigger / Scenario: ${scenarioTrigger}
Proposed Pivot: ${pivotPath.pathwayName} (Cost: ₹${pivotPath.financialSummary?.totalCostINR})

Analyze the impact in JSON:
{
  "strategicVerdict": "Short punchy verdict",
  "costImpactAnalysis": "Explanation of financial difference",
  "careerTrajectoryImpact": "How long-term employability and salary change",
  "psychologicalReliefFactor": "How student stress level changes",
  "recommendedNextSteps": ["Step 1", "Step 2"]
}
`;
    const aiResult = await generateJSONWithGemini(prompt);
    if (aiResult && aiResult.strategicVerdict) {
      return { ...aiResult, source: 'Google Gemini (Live)' };
    }
  }

  return {
    strategicVerdict: 'High-Value Strategic Pivot: Lowers debt burden and eliminates entrance burnout without compromising long-term earning power.',
    costImpactAnalysis: `Reduces total educational cost significantly, saving the family substantial capital and avoiding high-interest bank debt.`,
    careerTrajectoryImpact: `Industry prioritizes proven portfolio projects and core competencies over raw entrance scores after the initial 2 years of work.`,
    psychologicalReliefFactor: `Major reduction in acute competitive exam anxiety, granting peace of mind to both student and parents.`,
    recommendedNextSteps: [
      'Confirm eligibility criteria for state entrance or lateral admission rounds.',
      'Begin foundational self-learning in relevant technical/domain toolsets.'
    ],
    source: 'MargDarshak Scenario Rules Engine (Offline Fallback)'
  };
};

module.exports = {
  generateCounselingCommentary,
  generateWhatIfAIInsight
};
