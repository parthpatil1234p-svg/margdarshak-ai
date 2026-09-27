const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const { getDBStatus } = require('./config/db');
const { isGeminiAvailable } = require('./config/gemini');

// Import Route Handlers
const assessmentRoutes = require('./routes/assessmentRoutes');
const pathwayRoutes = require('./routes/pathwayRoutes');
const whatIfRoutes = require('./routes/whatIfRoutes');
const financeRoutes = require('./routes/financeRoutes');
const scholarshipRoutes = require('./routes/scholarshipRoutes');
const matrixRoutes = require('./routes/matrixRoutes');
const authRoutes = require('./routes/authRoutes');
const aiChatRoutes = require('./routes/aiChatRoutes');

const app = express();

// Security and middleware
app.use(helmet({
  contentSecurityPolicy: false // Allows inline assets, Chart.js and FontAwesome CDN for hackathon demo
}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend assets
app.use(express.static(path.join(__dirname, '../public')));

// Mount API Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiChatRoutes);
app.use('/api/assessment', assessmentRoutes);
app.use('/api/pathways', pathwayRoutes);
app.use('/api/what-if', whatIfRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/scholarships', scholarshipRoutes);
app.use('/api/matrix', matrixRoutes);

// Health and System Diagnostic endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = getDBStatus();
  const geminiLive = isGeminiAvailable();

  res.status(200).json({
    status: 'online',
    service: 'MargDarshak AI API (मार्गदर्शक AI)',
    version: '1.0.0',
    hackathon: 'HackMatrix 5.0 (Kali Yuga) - PCCOE Pune',
    track: 'Track 04: Miscellaneous (MISC-01)',
    sdgGoals: ['SDG 4: Quality Education', 'SDG 8: Decent Work & Economic Growth'],
    systemTime: new Date().toISOString(),
    database: dbStatus,
    aiEngine: {
      geminiLive,
      model: geminiLive ? 'gemini-1.5-flash / gemini-2.5-flash' : 'Deterministic Heuristic Fallback Engine (Offline Mode Active)',
      status: geminiLive ? 'Connected to Google Cloud' : 'Ready (Zero-Failure Fallback Enabled)'
    }
  });
});

// Fallback to index.html for single-page client routing
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ success: false, error: 'API route not found' });
  }
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[Application Error]', err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: err.message
  });
});

module.exports = app;
