const scenariosData = require('../data/whatIfScenarios.json');
const { simulateWhatIf } = require('../services/whatIfEngineService');

const getScenarios = (req, res) => {
  return res.status(200).json({ success: true, scenarios: scenariosData });
};

const executeWhatIfSimulation = async (req, res) => {
  try {
    const { scenarioId, currentPathway, customOverrides } = req.body;
    if (!scenarioId) {
      return res.status(400).json({ success: false, error: 'scenarioId is required.' });
    }

    const result = await simulateWhatIf({ scenarioId, currentPathway, customOverrides });

    return res.status(200).json({
      success: true,
      message: 'What-If scenario simulation executed successfully.',
      ...result
    });
  } catch (err) {
    console.error('[WhatIf Controller Error]', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { getScenarios, executeWhatIfSimulation };
