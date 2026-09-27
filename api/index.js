// Vercel Serverless API Entrypoint
require('dotenv').config();
const app = require('../src/app');
const { connectDB } = require('../src/config/db');

// Initialize database connection
connectDB();

module.exports = app;
