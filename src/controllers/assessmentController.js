const streamsData = require('../data/streams.json');
const { generateCounselingCommentary } = require('../services/aiReasoningService');

const evaluateAssessment = async (req, res) => {
  try {
    const {
      fullName = 'Student Aspirant',
      marks = { math: 75, science: 75, english: 75, social: 75 },
      interests = ['Coding & Software'],
      aptitudes = ['Analytical Thinking'],
      maxBudgetINR = 800000,
      preferredLocation = 'India',
      riskTolerance = 'Moderate',
      targetAspiration = 'Software Engineer',
      category = 'General',
      stateDomicile = 'Maharashtra'
    } = req.body;

    const math = Number(marks.math) || 0;
    const science = Number(marks.science) || 0;
    const english = Number(marks.english) || 0;
    const social = Number(marks.social) || 0;
    const overallPercentage = Math.round(((math + science + english + social) / 4) * 10) / 10;

    // Stream Recommendation Engine
    const streamFits = streamsData.map(stream => {
      let fitScore = 60; // baseline

      if (stream.id === 'STREAM_PCM') {
        if (math >= 80 && science >= 80) fitScore = 95;
        else if (math >= 65 && science >= 65) fitScore = 82;
        else fitScore = 55;
      } else if (stream.id === 'STREAM_PCB') {
        if (science >= 80) fitScore = 94;
        else if (science >= 65) fitScore = 80;
        else fitScore = 50;
      } else if (stream.id === 'STREAM_PCMB') {
        if (math >= 75 && science >= 75) fitScore = 88;
        else fitScore = 50;
      } else if (stream.id.includes('COMMERCE')) {
        if (interests.some(i => i.toLowerCase().includes('commerce') || i.toLowerCase().includes('finance'))) fitScore = 92;
        else if (math >= 60) fitScore = 80;
      } else if (stream.id === 'STREAM_HUMANITIES') {
        if (interests.some(i => i.toLowerCase().includes('law') || i.toLowerCase().includes('design') || i.toLowerCase().includes('arts'))) fitScore = 90;
        else if (english >= 75 && social >= 75) fitScore = 85;
      } else if (stream.id === 'STREAM_POLYTECHNIC_DIPLOMA') {
        if (maxBudgetINR < 400000 || riskTolerance === 'Conservative') fitScore = 93;
        else fitScore = 75;
      }

      return {
        streamId: stream.id,
        streamName: stream.name,
        category: stream.category,
        fitScore,
        difficultyLevel: stream.difficultyLevel,
        targetCompetitiveExams: stream.targetCompetitiveExams,
        undergraduateOptions: stream.undergraduateOptions,
        pros: stream.pros,
        cons: stream.cons
      };
    }).sort((a, b) => b.fitScore - a.fitScore);

    const profileData = {
      fullName,
      marks: { math, science, english, social, overallPercentage },
      interests,
      aptitudes,
      maxBudgetINR,
      preferredLocation,
      riskTolerance,
      targetAspiration,
      category,
      stateDomicile
    };

    return res.status(200).json({
      success: true,
      message: 'Intake assessment successfully evaluated.',
      profile: profileData,
      recommendedStreams: streamFits,
      topRecommendedStream: streamFits[0]
    });
  } catch (err) {
    console.error('[Assessment Controller Error]', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { evaluateAssessment };
