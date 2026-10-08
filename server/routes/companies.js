const express = require('express');
const router = express.Router();
const db = require('../db/init');
const auth = require('../middleware/auth');

// GET /companies
router.get('/', auth, (req, res) => {
  try {
    const topics = db.prepare('SELECT company_tags FROM topics').all();
    const companyCount = {};
    
    topics.forEach(t => {
      if (t.company_tags) {
        const companies = t.company_tags.split(',');
        companies.forEach(c => {
          const comp = c.trim();
          if (comp) {
            companyCount[comp] = (companyCount[comp] || 0) + 1;
          }
        });
      }
    });

    const result = Object.keys(companyCount).map(name => ({
      name,
      topicCount: companyCount[name]
    })).sort((a, b) => b.topicCount - a.topicCount);

    res.json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// GET /companies/:name/topics
router.get('/:name/topics', auth, (req, res) => {
  try {
    const companyName = req.params.name;
    const topics = db.prepare('SELECT * FROM topics WHERE company_tags LIKE ?').all(`%${companyName}%`);
    res.json(topics);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// GET /companies/:name/stats
router.get('/:name/stats', auth, (req, res) => {
  try {
    const companyName = req.params.name;
    
    const totalTopicsRow = db.prepare('SELECT COUNT(*) as count FROM topics WHERE company_tags LIKE ?').get(`%${companyName}%`) || { count: 0 };
    const totalTopics = totalTopicsRow.count;
    
    const completedTopicsRow = db.prepare(`
      SELECT COUNT(*) as count 
      FROM user_progress p
      JOIN topics t ON p.topic_id = t.id
      WHERE p.user_id = ? AND p.status = 'completed' AND t.company_tags LIKE ?
    `).get(req.user.id, `%${companyName}%`) || { count: 0 };
    const completedTopics = completedTopicsRow.count;
    
    res.json({
      company: companyName,
      total: totalTopics,
      completed: completedTopics,
      percentage: totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
