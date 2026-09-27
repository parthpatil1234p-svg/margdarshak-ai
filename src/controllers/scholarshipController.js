const scholarshipsData = require('../data/scholarships.json');

const matchScholarships = (req, res) => {
  try {
    const {
      marks = 80,
      familyIncomeINR = 600000,
      category = 'General',
      domicile = 'Maharashtra'
    } = req.query;

    const numMarks = Number(marks) || 75;
    const numIncome = Number(familyIncomeINR) || 800000;

    const matches = scholarshipsData.map(scholarship => {
      let isEligible = true;
      let reasons = [];

      if (scholarship.eligibility.minBoardPercentile && numMarks < scholarship.eligibility.minBoardPercentile) {
        isEligible = false;
        reasons.push(`Requires minimum ${scholarship.eligibility.minBoardPercentile}% board percentile (current: ${numMarks}%).`);
      }

      if (scholarship.eligibility.maxFamilyIncomeINR && numIncome > scholarship.eligibility.maxFamilyIncomeINR) {
        isEligible = false;
        reasons.push(`Family annual income limit is ₹${(scholarship.eligibility.maxFamilyIncomeINR / 100000).toFixed(1)}L (current: ₹${(numIncome / 100000).toFixed(1)}L).`);
      }

      return {
        ...scholarship,
        isEligible,
        disqualificationReasons: reasons,
        matchConfidence: isEligible ? 95 : 35
      };
    }).sort((a, b) => (b.isEligible ? 1 : 0) - (a.isEligible ? 1 : 0));

    return res.status(200).json({
      success: true,
      count: matches.length,
      eligibleCount: matches.filter(m => m.isEligible).length,
      scholarships: matches
    });
  } catch (err) {
    console.error('[Scholarship Controller Error]', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { matchScholarships };
