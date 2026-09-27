const mongoose = require('mongoose');

const SavedRoadmapSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  studentName: { type: String, required: true },
  profileSnapshot: { type: Object, required: true },
  pathwaysSnapshot: [{ type: Object }],
  aiCounselingSnapshot: { type: Object },
  notes: { type: String, default: '' },
  savedAt: { type: Date, default: Date.now }
});

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    salt: { type: String, required: true },
    userType: {
      type: String,
      enum: ['Student', 'Parent', 'Counselor', 'Judge'],
      default: 'Student'
    },
    targetAspiration: { type: String, default: '' },
    savedRoadmaps: [SavedRoadmapSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
