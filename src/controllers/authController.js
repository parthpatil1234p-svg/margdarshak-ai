const crypto = require('crypto');
const User = require('../models/User');
const { getDBStatus } = require('../config/db');

// In-Memory fallback store for offline/demo resilience
const inMemoryUsers = new Map();
const inMemorySessions = new Map();

// Helper: Hash password
const hashPassword = (password, salt) => {
  return crypto.scryptSync(password, salt, 64).toString('hex');
};

// Helper: Generate random token
const generateToken = () => crypto.randomBytes(32).toString('hex');

// Seed Demo Judge data
const getDemoJudgeData = () => {
  const salt = crypto.randomBytes(16).toString('hex');
  return {
    id: 'DEMO_JUDGE_USER',
    name: 'HackMatrix Judge (PCCOE Pune)',
    email: 'judge@hackmatrix.pccoe.in',
    passwordHash: hashPassword('hackmatrix2026', salt),
    salt,
    userType: 'Judge',
    targetAspiration: 'Track 04 Evaluation',
    savedRoadmaps: [
      {
        _id: 'ROADMAP_SAMPLE_1',
        title: 'Aarav - Biotech & Computational Genomics Pivot',
        studentName: 'Aarav Sharma',
        profileSnapshot: {
          fullName: 'Aarav Sharma',
          marks: { math: 68, science: 86, english: 78, social: 75, overallPercentage: 76.8 },
          interests: ['Biology & Life Sciences', 'Robotics'],
          maxBudgetINR: 600000,
          preferredLocation: 'India',
          riskTolerance: 'Moderate'
        },
        pathwaysSnapshot: [],
        aiCounselingSnapshot: {
          executiveCounselorSummary: 'Strong aptitude in biological sciences with balanced tech acumen.',
          parentFinancialGuidance: 'Avoid ₹80L+ private medical colleges. Prioritize State Autonomous Biotech tracks.'
        },
        notes: 'Pre-saved evaluation benchmark for NEET contingency testing.',
        savedAt: new Date(Date.now() - 3600000)
      },
      {
        _id: 'ROADMAP_SAMPLE_2',
        title: 'Rajesh Patil - Debt-Free Polytechnic to DSE Route',
        studentName: 'Rajesh Patil',
        profileSnapshot: {
          fullName: 'Rajesh Patil',
          marks: { math: 74, science: 76, english: 70, social: 72, overallPercentage: 73 },
          interests: ['Applied Engineering', 'Computers & Automation'],
          maxBudgetINR: 400000,
          preferredLocation: 'India',
          riskTolerance: 'Conservative'
        },
        pathwaysSnapshot: [],
        aiCounselingSnapshot: {
          executiveCounselorSummary: 'Excellent practical orientation. Lateral engineering entry eliminates entrance pressure.',
          parentFinancialGuidance: 'Zero student debt achieved via Govt Polytechnic and MahaDBT scholarship.'
        },
        notes: 'Cost-optimized parent roadmap benchmark.',
        savedAt: new Date(Date.now() - 7200000)
      }
    ]
  };
};

// Initialize in-memory judge
const demoJudge = getDemoJudgeData();
inMemoryUsers.set(demoJudge.email, demoJudge);

/**
 * Register a new user
 */
const register = async (req, res) => {
  try {
    const { name, email, password, userType = 'Student', targetAspiration = '' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Name, email, and password are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const dbStatus = getDBStatus();

    // Check if user already exists
    if (dbStatus.connected) {
      const existing = await User.findOne({ email: cleanEmail });
      if (existing) {
        return res.status(400).json({ success: false, error: 'Account with this email already exists.' });
      }

      const salt = crypto.randomBytes(16).toString('hex');
      const passwordHash = hashPassword(password, salt);

      const newUser = await User.create({
        name: name.trim(),
        email: cleanEmail,
        passwordHash,
        salt,
        userType,
        targetAspiration,
        savedRoadmaps: []
      });

      const token = generateToken();
      inMemorySessions.set(token, { userId: newUser._id.toString(), email: cleanEmail });

      return res.status(201).json({
        success: true,
        message: 'Account registered successfully.',
        token,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          userType: newUser.userType,
          savedRoadmapsCount: 0
        }
      });
    } else {
      // In-Memory Mode
      if (inMemoryUsers.has(cleanEmail)) {
        return res.status(400).json({ success: false, error: 'Account with this email already exists.' });
      }

      const salt = crypto.randomBytes(16).toString('hex');
      const user = {
        id: 'user_' + Date.now(),
        name: name.trim(),
        email: cleanEmail,
        passwordHash: hashPassword(password, salt),
        salt,
        userType,
        targetAspiration,
        savedRoadmaps: []
      };
      inMemoryUsers.set(cleanEmail, user);

      const token = generateToken();
      inMemorySessions.set(token, { userId: user.id, email: cleanEmail });

      return res.status(201).json({
        success: true,
        message: 'Account registered successfully (Demo Mode).',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          userType: user.userType,
          savedRoadmapsCount: 0
        }
      });
    }
  } catch (err) {
    console.error('[Auth Register Error]', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * Login user
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const dbStatus = getDBStatus();

    let user = null;
    if (dbStatus.connected) {
      user = await User.findOne({ email: cleanEmail });
    } else {
      user = inMemoryUsers.get(cleanEmail);
    }

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    const attemptHash = hashPassword(password, user.salt);
    if (attemptHash !== user.passwordHash) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    const token = generateToken();
    const userId = user._id ? user._id.toString() : user.id;
    inMemorySessions.set(token, { userId, email: cleanEmail });

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: userId,
        name: user.name,
        email: user.email,
        userType: user.userType,
        savedRoadmapsCount: user.savedRoadmaps ? user.savedRoadmaps.length : 0
      }
    });
  } catch (err) {
    console.error('[Auth Login Error]', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * 1-Click Hackathon Judge Demo Login
 */
const demoJudgeLogin = async (req, res) => {
  try {
    const cleanEmail = demoJudge.email;
    const dbStatus = getDBStatus();

    let user = null;
    if (dbStatus.connected) {
      user = await User.findOne({ email: cleanEmail });
      if (!user) {
        user = await User.create(demoJudge);
      }
    } else {
      user = inMemoryUsers.get(cleanEmail) || demoJudge;
    }

    const token = generateToken();
    const userId = user._id ? user._id.toString() : user.id;
    inMemorySessions.set(token, { userId, email: cleanEmail });

    return res.status(200).json({
      success: true,
      message: 'Judge Demo Session Activated.',
      token,
      user: {
        id: userId,
        name: user.name,
        email: user.email,
        userType: user.userType,
        savedRoadmapsCount: user.savedRoadmaps ? user.savedRoadmaps.length : 2
      }
    });
  } catch (err) {
    console.error('[Demo Judge Login Error]', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * Get current logged in user & roadmaps
 */
const getMe = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token || !inMemorySessions.has(token)) {
      return res.status(401).json({ success: false, error: 'Unauthorized. Please log in.' });
    }

    const session = inMemorySessions.get(token);
    const dbStatus = getDBStatus();

    let user = null;
    if (dbStatus.connected) {
      user = await User.findById(session.userId);
    } else {
      user = inMemoryUsers.get(session.email);
    }

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found.' });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id ? user._id.toString() : user.id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        targetAspiration: user.targetAspiration,
        savedRoadmapsCount: user.savedRoadmaps ? user.savedRoadmaps.length : 0,
        savedRoadmaps: user.savedRoadmaps || []
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * Save current simulation roadmap to user profile
 */
const saveRoadmap = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token || !inMemorySessions.has(token)) {
      return res.status(401).json({ success: false, error: 'Please log in to save your career roadmaps.' });
    }

    const session = inMemorySessions.get(token);
    const {
      title,
      studentName = 'Student',
      profileSnapshot,
      pathwaysSnapshot = [],
      aiCounselingSnapshot = {},
      notes = ''
    } = req.body;

    if (!title || !profileSnapshot) {
      return res.status(400).json({ success: false, error: 'Title and profile snapshot are required.' });
    }

    const newRoadmap = {
      _id: 'roadmap_' + Date.now(),
      title: title.trim(),
      studentName,
      profileSnapshot,
      pathwaysSnapshot,
      aiCounselingSnapshot,
      notes,
      savedAt: new Date()
    };

    const dbStatus = getDBStatus();
    if (dbStatus.connected) {
      const user = await User.findById(session.userId);
      if (!user) return res.status(404).json({ success: false, error: 'User not found.' });

      user.savedRoadmaps.unshift(newRoadmap);
      await user.save();

      return res.status(201).json({
        success: true,
        message: 'Career roadmap successfully saved to your profile!',
        savedRoadmap: user.savedRoadmaps[0],
        totalSavedCount: user.savedRoadmaps.length
      });
    } else {
      const user = inMemoryUsers.get(session.email);
      if (!user) return res.status(404).json({ success: false, error: 'User not found.' });

      user.savedRoadmaps.unshift(newRoadmap);
      return res.status(201).json({
        success: true,
        message: 'Career roadmap successfully saved to your profile (Demo Mode)!',
        savedRoadmap: newRoadmap,
        totalSavedCount: user.savedRoadmaps.length
      });
    }
  } catch (err) {
    console.error('[Save Roadmap Error]', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * Get all saved roadmaps for logged-in user
 */
const getSavedRoadmaps = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token || !inMemorySessions.has(token)) {
      return res.status(401).json({ success: false, error: 'Unauthorized.' });
    }

    const session = inMemorySessions.get(token);
    const dbStatus = getDBStatus();

    let user = null;
    if (dbStatus.connected) {
      user = await User.findById(session.userId);
    } else {
      user = inMemoryUsers.get(session.email);
    }

    if (!user) return res.status(404).json({ success: false, error: 'User not found.' });

    return res.status(200).json({
      success: true,
      count: user.savedRoadmaps?.length || 0,
      savedRoadmaps: user.savedRoadmaps || []
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * Delete a saved roadmap
 */
const deleteSavedRoadmap = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token || !inMemorySessions.has(token)) {
      return res.status(401).json({ success: false, error: 'Unauthorized.' });
    }

    const { id } = req.params;
    const session = inMemorySessions.get(token);
    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      const user = await User.findById(session.userId);
      if (!user) return res.status(404).json({ success: false, error: 'User not found.' });

      user.savedRoadmaps = user.savedRoadmaps.filter(r => r._id.toString() !== id);
      await user.save();

      return res.status(200).json({
        success: true,
        message: 'Saved roadmap deleted successfully.',
        remainingCount: user.savedRoadmaps.length
      });
    } else {
      const user = inMemoryUsers.get(session.email);
      if (!user) return res.status(404).json({ success: false, error: 'User not found.' });

      user.savedRoadmaps = user.savedRoadmaps.filter(r => r._id !== id);
      return res.status(200).json({
        success: true,
        message: 'Saved roadmap deleted successfully (Demo Mode).',
        remainingCount: user.savedRoadmaps.length
      });
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  register,
  login,
  demoJudgeLogin,
  getMe,
  saveRoadmap,
  getSavedRoadmaps,
  deleteSavedRoadmap
};
