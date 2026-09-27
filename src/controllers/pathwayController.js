const { simulatePathways } = require('../services/pathwaySimulationService');
const { generateCounselingCommentary } = require('../services/aiReasoningService');
const streamsData = require('../data/streams.json');

const getStreams = (req, res) => {
  return res.status(200).json({ success: true, streams: streamsData });
};

const simulateStudentPathways = async (req, res) => {
  try {
    const studentProfile = req.body;
    if (!studentProfile || !studentProfile.marks) {
      return res.status(400).json({ success: false, error: 'Student profile with marks is required.' });
    }

    const pathways = simulatePathways(studentProfile);
    const aiCounseling = await generateCounselingCommentary(studentProfile, pathways);

    return res.status(200).json({
      success: true,
      message: 'Pathways successfully simulated across multiple trajectories.',
      studentProfile,
      pathways,
      aiCounseling
    });
  } catch (err) {
    console.error('[Pathway Controller Error]', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { getStreams, simulateStudentPathways };
