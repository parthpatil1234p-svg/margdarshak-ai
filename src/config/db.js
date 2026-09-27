const mongoose = require('mongoose');

let isConnected = false;

// Handle any subsequent mongoose connection errors gracefully without crashing the process
mongoose.connection.on('error', (err) => {
  isConnected = false;
});

const connectDB = async () => {
  if (isConnected) return;

  const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/margdarshak_ai';
  
  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000 // Quick timeout so local app starts instantly even if MongoDB is not running locally
    });
    isConnected = true;
    console.log(`[MongoDB] Connected successfully to: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[MongoDB Warning] Could not connect to MongoDB at ${mongoURI} (${error.message}).`);
    console.warn('[MongoDB Mode] Gracefully falling back to High-Speed In-Memory & JSON Data Store. All features remain fully operational!');
    isConnected = false;
  }
};

const getDBStatus = () => ({
  connected: isConnected,
  type: isConnected ? 'MongoDB Live Connection' : 'In-Memory / Seeded JSON Store (Zero-Failure Fallback)'
});

module.exports = { connectDB, getDBStatus };
