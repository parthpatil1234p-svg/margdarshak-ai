const { calculateEducationLoan } = require('../services/loanCalculatorService');
const institutionsData = require('../data/institutions.json');

const calculateLoan = (req, res) => {
  try {
    const {
      totalEducationCostINR,
      familyContributionINR,
      scholarshipINR,
      annualInterestRate,
      tenureYears,
      medianStartingSalaryINR
    } = req.body;

    const result = calculateEducationLoan({
      totalEducationCostINR: Number(totalEducationCostINR) || 1200000,
      familyContributionINR: Number(familyContributionINR) || 400000,
      scholarshipINR: Number(scholarshipINR) || 0,
      annualInterestRate: Number(annualInterestRate) || 9.5,
      tenureYears: Number(tenureYears) || 7,
      medianStartingSalaryINR: Number(medianStartingSalaryINR) || 1000000
    });

    return res.status(200).json({
      success: true,
      message: 'Loan ROI and Borrowing Index calculated successfully.',
      calculation: result
    });
  } catch (err) {
    console.error('[Finance Controller Error]', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

const getInstitutions = (req, res) => {
  const { country, tier } = req.query;
  let list = [...institutionsData];
  if (country) {
    list = list.filter(inst => inst.country.toLowerCase().includes(country.toLowerCase()));
  }
  if (tier) {
    list = list.filter(inst => inst.tier.toLowerCase().includes(tier.toLowerCase()));
  }
  return res.status(200).json({ success: true, count: list.length, institutions: list });
};

module.exports = { calculateLoan, getInstitutions };
