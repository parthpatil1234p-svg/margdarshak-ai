require('dotenv').config();
const app = require('./src/app');
const { connectDB } = require('./src/config/db');

const PORT = process.env.PORT || 5000;

// Connect to Database (graceful offline fallback if unavailable)
connectDB();

const server = app.listen(PORT, () => {
  console.log('====================================================');
  console.log('🚀 MARGDARSHAK AI (मार्गदर्शक AI) IS RUNNING');
  console.log(`🌐 Local Web Portal: http://localhost:${PORT}`);
  console.log(`📡 Health Check API: http://localhost:${PORT}/api/health`);
  console.log('🏆 HackMatrix 5.0 | Track 04: Miscellaneous (MISC-01)');
  console.log('🌱 Aligned with SDG 4 (Quality Education) & SDG 8 (Decent Work)');
  console.log('====================================================');
});

// Process resilience handlers
process.on('uncaughtException', (err) => {
  console.warn('[Server Warning] Uncaught exception caught safely:', err.message);
});

process.on('unhandledRejection', (reason, promise) => {
  console.warn('[Server Warning] Unhandled rejection caught safely:', reason?.message || reason);
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
