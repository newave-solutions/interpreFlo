const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Database = require('better-sqlite3');
const path = require('path');
const rateLimit = require('express-rate-limit');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3001;

// Generate a secure random secret if not provided via environment variable
const JWT_SECRET = process.env.JWT_SECRET || (() => {
  console.warn('WARNING: JWT_SECRET not set in environment. Generating a random secret for this session.');
  console.warn('For production, set JWT_SECRET environment variable to persist sessions across restarts.');
  return crypto.randomBytes(64).toString('hex');
})();

// Initialize database
const db = new Database('interpreflo.db');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS practice_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    scenario_id TEXT NOT NULL,
    duration INTEGER NOT NULL,
    pitch_avg REAL,
    volume_avg REAL,
    clarity_score REAL,
    overall_score REAL,
    recording_data TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS user_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    total_sessions INTEGER DEFAULT 0,
    total_practice_time INTEGER DEFAULT 0,
    average_score REAL DEFAULT 0,
    scenarios_completed TEXT,
    achievements TEXT,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(user_id)
  );

  CREATE TABLE IF NOT EXISTS vocal_analytics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER NOT NULL,
    timestamp INTEGER NOT NULL,
    pitch REAL,
    volume REAL,
    clarity REAL,
    FOREIGN KEY (session_id) REFERENCES practice_sessions(id)
  );
`);

// Middleware
// CORS configuration - allow development and production origins
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ['http://localhost:3000', 'http://localhost:3001'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: 'Too many authentication attempts, please try again later.'
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.'
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token.' });
    }
    req.user = user;
    next();
  });
};

// Auth routes
app.post('/api/register', authLimiter, async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const stmt = db.prepare('INSERT INTO users (username, email, password) VALUES (?, ?, ?)');
    const result = stmt.run(username, email, hashedPassword);

    // Initialize user progress
    const progressStmt = db.prepare('INSERT INTO user_progress (user_id) VALUES (?)');
    progressStmt.run(result.lastInsertRowid);

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      res.status(400).json({ error: 'Username or email already exists.' });
    } else {
      res.status(500).json({ error: 'Registration failed.' });
    }
  }
});

app.post('/api/login', authLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required.' });
    }

    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed.' });
  }
});

// Practice scenarios
const scenarios = [
  {
    id: 'emergency-admission',
    title: 'Emergency Room Admission',
    description: 'Interpret a patient admission scenario in an emergency room setting.',
    difficulty: 'beginner',
    script: 'Hello, I need help. I have severe chest pain and shortness of breath.',
    duration: 60
  },
  {
    id: 'patient-history',
    title: 'Taking Patient History',
    description: 'Interpret during a doctor-patient conversation about medical history.',
    difficulty: 'intermediate',
    script: 'Can you tell me about your medical history? Do you have any allergies?',
    duration: 90
  },
  {
    id: 'diagnosis-explanation',
    title: 'Explaining Diagnosis',
    description: 'Interpret complex medical diagnosis information to the patient.',
    difficulty: 'advanced',
    script: 'The tests show that you have hypertension. We need to start treatment immediately.',
    duration: 120
  },
  {
    id: 'surgical-consent',
    title: 'Surgical Consent Process',
    description: 'Interpret during the surgical consent discussion.',
    difficulty: 'advanced',
    script: 'I need to explain the surgical procedure and its risks. Do you understand the process?',
    duration: 120
  },
  {
    id: 'medication-instructions',
    title: 'Medication Instructions',
    description: 'Interpret medication dosage and usage instructions.',
    difficulty: 'intermediate',
    script: 'Take two tablets every morning with food. Avoid alcohol while on this medication.',
    duration: 60
  }
];

app.get('/api/scenarios', apiLimiter, authenticateToken, (req, res) => {
  res.json(scenarios);
});

app.get('/api/scenarios/:id', apiLimiter, authenticateToken, (req, res) => {
  const scenario = scenarios.find(s => s.id === req.params.id);
  if (!scenario) {
    return res.status(404).json({ error: 'Scenario not found.' });
  }
  res.json(scenario);
});

// Practice session routes
app.post('/api/sessions', apiLimiter, authenticateToken, (req, res) => {
  try {
    const { scenario_id, duration, pitch_avg, volume_avg, clarity_score, overall_score, recording_data, analytics } = req.body;

    const stmt = db.prepare(`
      INSERT INTO practice_sessions 
      (user_id, scenario_id, duration, pitch_avg, volume_avg, clarity_score, overall_score, recording_data) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(req.user.id, scenario_id, duration, pitch_avg, volume_avg, clarity_score, overall_score, recording_data);

    // Save analytics data
    if (analytics && analytics.length > 0) {
      const analyticsStmt = db.prepare(`
        INSERT INTO vocal_analytics (session_id, timestamp, pitch, volume, clarity)
        VALUES (?, ?, ?, ?, ?)
      `);

      const insertMany = db.transaction((data) => {
        for (const point of data) {
          analyticsStmt.run(result.lastInsertRowid, point.timestamp, point.pitch, point.volume, point.clarity);
        }
      });

      insertMany(analytics);
    }

    // Update user progress
    const progress = db.prepare('SELECT * FROM user_progress WHERE user_id = ?').get(req.user.id);
    const scenariosCompleted = progress.scenarios_completed ? JSON.parse(progress.scenarios_completed) : [];
    
    if (!scenariosCompleted.includes(scenario_id)) {
      scenariosCompleted.push(scenario_id);
    }

    const newTotalSessions = progress.total_sessions + 1;
    const newTotalTime = progress.total_practice_time + duration;
    const newAvgScore = ((progress.average_score * progress.total_sessions) + overall_score) / newTotalSessions;

    db.prepare(`
      UPDATE user_progress 
      SET total_sessions = ?, 
          total_practice_time = ?, 
          average_score = ?, 
          scenarios_completed = ?,
          last_updated = CURRENT_TIMESTAMP
      WHERE user_id = ?
    `).run(newTotalSessions, newTotalTime, newAvgScore, JSON.stringify(scenariosCompleted), req.user.id);

    res.status(201).json({ 
      message: 'Session saved successfully.',
      sessionId: result.lastInsertRowid
    });
  } catch (error) {
    console.error('Error saving session:', error);
    res.status(500).json({ error: 'Failed to save session.' });
  }
});

app.get('/api/sessions', apiLimiter, authenticateToken, (req, res) => {
  try {
    const sessions = db.prepare(`
      SELECT id, scenario_id, duration, pitch_avg, volume_avg, clarity_score, overall_score, created_at
      FROM practice_sessions 
      WHERE user_id = ? 
      ORDER BY created_at DESC
      LIMIT 50
    `).all(req.user.id);

    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sessions.' });
  }
});

app.get('/api/sessions/:id', apiLimiter, authenticateToken, (req, res) => {
  try {
    const session = db.prepare(`
      SELECT * FROM practice_sessions 
      WHERE id = ? AND user_id = ?
    `).get(req.params.id, req.user.id);

    if (!session) {
      return res.status(404).json({ error: 'Session not found.' });
    }

    const analytics = db.prepare(`
      SELECT timestamp, pitch, volume, clarity
      FROM vocal_analytics 
      WHERE session_id = ?
      ORDER BY timestamp
    `).all(session.id);

    res.json({ ...session, analytics });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch session.' });
  }
});

// Progress routes
app.get('/api/progress', apiLimiter, authenticateToken, (req, res) => {
  try {
    const progress = db.prepare('SELECT * FROM user_progress WHERE user_id = ?').get(req.user.id);

    if (!progress) {
      return res.status(404).json({ error: 'Progress not found.' });
    }

    const scenariosCompleted = progress.scenarios_completed ? JSON.parse(progress.scenarios_completed) : [];
    const achievements = progress.achievements ? JSON.parse(progress.achievements) : [];

    res.json({
      ...progress,
      scenarios_completed: scenariosCompleted,
      achievements
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch progress.' });
  }
});

// Dashboard stats
app.get('/api/stats', apiLimiter, authenticateToken, (req, res) => {
  try {
    const progress = db.prepare('SELECT * FROM user_progress WHERE user_id = ?').get(req.user.id);
    
    const recentSessions = db.prepare(`
      SELECT scenario_id, overall_score, created_at
      FROM practice_sessions 
      WHERE user_id = ? 
      ORDER BY created_at DESC
      LIMIT 10
    `).all(req.user.id);

    const scoresByScenario = db.prepare(`
      SELECT scenario_id, AVG(overall_score) as avg_score, COUNT(*) as count
      FROM practice_sessions 
      WHERE user_id = ?
      GROUP BY scenario_id
    `).all(req.user.id);

    res.json({
      progress: {
        total_sessions: progress.total_sessions,
        total_practice_time: progress.total_practice_time,
        average_score: progress.average_score,
        scenarios_completed: progress.scenarios_completed ? JSON.parse(progress.scenarios_completed).length : 0
      },
      recent_sessions: recentSessions,
      scores_by_scenario: scoresByScenario
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics.' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
