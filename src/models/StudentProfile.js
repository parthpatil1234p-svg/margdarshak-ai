const mongoose = require('mongoose');

const StudentProfileSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    grade: { type: Number, default: 10 },
    marks: {
      math: { type: Number, required: true, min: 0, max: 100 },
      science: { type: Number, required: true, min: 0, max: 100 },
      english: { type: Number, required: true, min: 0, max: 100 },
      social: { type: Number, required: true, min: 0, max: 100 },
      overallPercentage: { type: Number, min: 0, max: 100 }
    },
    interests: [{ type: String }],
    aptitudes: [{ type: String }],
    maxBudgetINR: { type: Number, required: true },
    preferredLocation: {
      type: String,
      enum: ['India', 'Abroad', 'Both'],
      default: 'India'
    },
    riskTolerance: {
      type: String,
      enum: ['Conservative', 'Moderate', 'Ambitious'],
      default: 'Moderate'
    },
    targetAspiration: { type: String, default: 'Open to Exploration' },
    category: {
      type: String,
      enum: ['General', 'OBC', 'SC', 'ST', 'EWS'],
      default: 'General'
    },
    stateDomicile: { type: String, default: 'Maharashtra' }
  },
  { timestamps: true }
);

// Auto-calculate overallPercentage before save
StudentProfileSchema.pre('save', function (next) {
  if (this.marks) {
    const { math = 0, science = 0, english = 0, social = 0 } = this.marks;
    this.marks.overallPercentage = Math.round(((math + science + english + social) / 4) * 10) / 10;
  }
  next();
});

module.exports = mongoose.model('StudentProfile', StudentProfileSchema);
