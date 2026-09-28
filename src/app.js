const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const { getDBStatus } = require('./config/db');
const { getGeminiStatus } = require('./config/gemini');

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
// Flexible CORS for Vercel Frontend + Local Development
app.use(cors({
  origin: (origin, callback) => {
    // Allow local development, server-to-server, and any Vercel/Render origins
    if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1') || origin.endsWith('.vercel.app') || origin.endsWith('.onrender.com')) {
      return callback(null, true);
    }
    return callback(null, true); // Fallback permissive for hackathon live judging
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
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
  const geminiStatus = getGeminiStatus();

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
      geminiConfigured: geminiStatus.configured,
      geminiLive: geminiStatus.connected,
      state: geminiStatus.state,
      model: geminiStatus.model || (geminiStatus.configured ? 'Google Gemini (connection unverified)' : 'Deterministic Heuristic Fallback Engine'),
      status: geminiStatus.state === 'connected'
        ? 'Connected to Google Cloud'
        : geminiStatus.state === 'unavailable'
          ? 'Gemini unavailable; offline fallback active'
          : geminiStatus.state === 'unverified'
            ? 'Gemini configured; connection not verified'
            : 'Offline fallback active'
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
