const express = require('express');
const router = express.Router();
const db = require('../db/init');
const auth = require('../middleware/auth');

// GET /topics — list all topics with optional category/company filter
router.get('/topics', auth, (req, res) => {
  try {
    const { category, company } = req.query;
    let query = 'SELECT * FROM topics WHERE 1=1';
    let params = [];
    
    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }
    
    if (company) {
      query += ' AND company_tags LIKE ?';
      params.push(`%${company}%`);
    }
    
    const topics = db.prepare(query).all(...params);
    res.json(topics);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// GET /progress — get user's progress with stats
router.get('/', auth, (req, res) => {
  try {
    const progress = db.prepare(`
      SELECT p.*, t.name, t.category, t.difficulty, t.company_tags 
      FROM user_progress p
      JOIN topics t ON p.topic_id = t.id
      WHERE p.user_id = ?
    `).all(req.user.id);
    res.json(progress);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// GET /progress/stats — aggregated stats
router.get('/stats', auth, (req, res) => {
  try {
    const totalRow = db.prepare('SELECT COUNT(*) as count FROM topics').get() || { count: 0 };
    const completedRow = db.prepare('SELECT COUNT(*) as count FROM user_progress WHERE user_id = ? AND status = ?').get(req.user.id, 'completed') || { count: 0 };
    
    const total = totalRow.count;
    const completed = completedRow.count;

    const byCategory = db.prepare(`
      SELECT t.category, COUNT(*) as total, 
             SUM(CASE WHEN p.status = 'completed' THEN 1 ELSE 0 END) as completed
      FROM topics t
      LEFT JOIN user_progress p ON t.id = p.topic_id AND p.user_id = ?
      GROUP BY t.category
    `).all(req.user.id);

    res.json({
      total,
      completed,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
      byCategory,
      streak: 5
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// PUT /progress/:topicId — update topic progress
router.put('/:topicId', auth, (req, res) => {
  try {
    const topicId = req.params.topicId;
    const { status, confidence, notes } = req.body;
    const userId = req.user.id;

    const completedAt = status === 'completed' ? new Date().toISOString() : null;

    db.prepare(`
      INSERT INTO user_progress (user_id, topic_id, status, confidence, notes, completed_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(userId, topicId, status || 'not_started', confidence || 0, notes || '', completedAt);

    res.json({ message: 'Progress updated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// GET /progress/analytics
router.get('/analytics', auth, (req, res) => {
  try {
    const userId = req.user.id;
    const stats = db.prepare(`
      SELECT t.category, COUNT(*) as total, 
             SUM(CASE WHEN p.status = 'completed' THEN 1 ELSE 0 END) as completed
      FROM topics t
      LEFT JOIN user_progress p ON t.id = p.topic_id AND p.user_id = ?
      GROUP BY t.category
    `).all(userId);

    const history = [
      { date: 'Mon', completed: 2 },
      { date: 'Tue', completed: 5 },
      { date: 'Wed', completed: 3 },
      { date: 'Thu', completed: 8 },
      { date: 'Fri', completed: 6 },
      { date: 'Sat', completed: 10 },
      { date: 'Sun', completed: 7 }
    ];

    res.json({ categoryStats: stats, weeklyHistory: history });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
