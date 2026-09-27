/**
 * Financial Feasibility & Loan ROI Calculation Service
 * Computes exact loan principal, EMI, total interest, debt-to-income (DTI) ratio,
 * and realistic payback years based on career starting salary.
 */

const calculateEducationLoan = ({
  totalEducationCostINR = 1200000,
  familyContributionINR = 400000,
  scholarshipINR = 100000,
  annualInterestRate = 9.5, // Standard SBI / Canara Bank Student Loan rate
  tenureYears = 7,
  medianStartingSalaryINR = 1000000
}) => {
  // Principal needed after family savings and scholarships
  const netRequired = Math.max(0, totalEducationCostINR - familyContributionINR - scholarshipINR);
  const principal = Math.round(netRequired);

  if (principal <= 0) {
    return {
      principalLoanINR: 0,
      totalEducationCostINR,
      familyContributionINR,
      scholarshipINR,
      annualInterestRate,
      tenureYears,
      monthlyEMI: 0,
      totalInterestINR: 0,
      totalPaymentINR: 0,
      monthlyInHandSalaryINR: Math.round((medianStartingSalaryINR * 0.85) / 12),
      debtToIncomeRatioPercent: 0,
      paybackYears: 0,
      borrowingIndexScore: 98,
      riskCategory: 'Debt-Free (Optimal Financial Health)',
      recommendation: 'Zero loan required! Family savings and scholarships completely cover educational costs.'
    };
  }

  // Monthly interest rate and tenure
  const r = annualInterestRate / (12 * 100);
  const n = tenureYears * 12;

  // Standard EMI formula: P * r * (1+r)^n / ((1+r)^n - 1)
  const factor = Math.pow(1 + r, n);
  const monthlyEMI = Math.round((principal * r * factor) / (factor - 1));
  const totalPayment = Math.round(monthlyEMI * n);
  const totalInterest = Math.max(0, totalPayment - principal);

  // Salary ROI & Borrowing Index
  // Assuming 15% deductions for PF/Taxes in entry roles -> 85% in-hand
  const annualInHand = medianStartingSalaryINR * 0.85;
  const monthlyInHand = Math.round(annualInHand / 12);
  const debtToIncomeRatio = Math.round((monthlyEMI / monthlyInHand) * 1000) / 10;

  // Payback years assuming 35% of net disposable income allocated towards repayment
  const annualRepaymentCapacity = annualInHand * 0.35;
  const paybackYears = Math.round((totalPayment / annualRepaymentCapacity) * 10) / 10;

  let riskCategory = 'Low Risk (Safe Investment)';
  let borrowingIndexScore = 85;
  let recommendation = 'Very healthy loan-to-income profile. Easily payable within 3 years of employment.';

  if (debtToIncomeRatio > 45 || paybackYears > 6) {
    riskCategory = 'High Burden (Overleveraged Alert)';
    borrowingIndexScore = 42;
    recommendation = 'CAUTION: Loan repayment will consume over 45% of monthly salary. Strongly consider government colleges, state scholarships, or polytechnic routes.';
  } else if (debtToIncomeRatio > 25 || paybackYears > 3.5) {
    riskCategory = 'Moderate Risk (Manageable)';
    borrowingIndexScore = 70;
    recommendation = 'Manageable debt burden. Requires financial discipline during the first 4-5 years of career.';
  }

  return {
    principalLoanINR: principal,
    totalEducationCostINR,
    familyContributionINR,
    scholarshipINR,
    annualInterestRate,
    tenureYears,
    monthlyEMI,
    totalInterestINR: totalInterest,
    totalPaymentINR: totalPayment,
    monthlyInHandSalaryINR: monthlyInHand,
    debtToIncomeRatioPercent: debtToIncomeRatio,
    paybackYears,
    borrowingIndexScore,
    riskCategory,
    recommendation
  };
};

module.exports = { calculateEducationLoan };
