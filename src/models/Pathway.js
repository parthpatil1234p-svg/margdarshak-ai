const mongoose = require('mongoose');

const StageSchema = new mongoose.Schema({
  stepNumber: { type: Number, required: true },
  stageType: {
    type: String,
    enum: ['CLASS_10', 'STREAM_11_12', 'ENTRANCE_UG', 'SPECIALIZATION', 'CAREER_ENTRY'],
    required: true
  },
  title: { type: String, required: true },
  subtitle: { type: String },
  durationYears: { type: Number, default: 1 },
  estimatedCostINR: { type: Number, default: 0 },
  entranceExams: [{ type: String }],
  keyMilestones: [{ type: String }],
  difficultyIndex: { type: String, enum: ['Low', 'Moderate', 'High', 'Extreme'], default: 'Moderate' }
});

const PathwaySchema = new mongoose.Schema(
  {
    pathwayId: { type: String, required: true },
    pathwayName: { type: String, required: true },
    tag: {
      type: String,
      enum: ['PRIMARY_ASPIRANT', 'APPLIED_INDUSTRY', 'COST_OPTIMIZED', 'WHAT_IF_PIVOT'],
      default: 'PRIMARY_ASPIRANT'
    },
    streamCode: { type: String, required: true },
    targetCareer: {
      role: { type: String, required: true },
      medianSalaryINR: { type: Number, required: true },
      fiveYearSalaryINR: { type: Number },
      growthOutlook: { type: String }
    },
    stages: [StageSchema],
    financialSummary: {
      totalCostINR: { type: Number, required: true },
      estimatedScholarshipINR: { type: Number, default: 0 },
      netCostToFamilyINR: { type: Number, required: true },
      loanPrincipalNeededINR: { type: Number, default: 0 },
      monthlyEMI: { type: Number, default: 0 },
      loanPaybackYears: { type: Number, default: 0 },
      borrowingRiskLevel: { type: String, enum: ['Low Risk', 'Moderate', 'High Burden', 'Debt-Free'], default: 'Moderate' }
    },
    yearsToEarning: { type: Number, required: true },
    competitiveRisk: { type: String, enum: ['Low', 'Moderate', 'High', 'Extreme'], default: 'Moderate' },
    aiConfidenceScore: { type: Number, min: 0, max: 100, default: 85 },
    assumptionsAndCaveats: [{ type: String }],
    whyThisPathWorks: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Pathway', PathwaySchema);
