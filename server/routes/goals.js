const express = require('express');
const router = express.Router();
const db = require('../db/init');
const auth = require('../middleware/auth');

// GET /goals/today
router.get('/today', auth, (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    let goals = db.prepare('SELECT * FROM daily_goals WHERE user_id = ? AND date = ?').get(req.user.id, today);
    
    if (!goals) {
      const defaultGoals = [
        { id: 1, text: "Solve 2 DSA Medium questions on Dynamic Programming", completed: false },
        { id: 2, text: "Revise Operating System Process & Threading concepts", completed: false },
        { id: 3, text: "Practice 1 Technical Mock Interview scenario", completed: false },
        { id: 4, text: "Review SQL Joins and Normalization notes", completed: false }
      ];
      
      db.prepare(`
        INSERT INTO daily_goals (user_id, date, goals_json, completed_count, total_count)
        VALUES (?, ?, ?, ?, ?)
      `).run(req.user.id, today, JSON.stringify(defaultGoals), 0, defaultGoals.length);
      
      goals = db.prepare('SELECT * FROM daily_goals WHERE user_id = ? AND date = ?').get(req.user.id, today);
    }
    
    res.json(goals);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// POST /goals — update daily goal list
router.post('/', auth, (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const { goals } = req.body; // Array of goal items
    
    const completedCount = goals.filter(g => g.completed).length;
    const totalCount = goals.length;

    let existing = db.prepare('SELECT * FROM daily_goals WHERE user_id = ? AND date = ?').get(req.user.id, today);
    
    if (existing) {
      db.prepare(`
        UPDATE daily_goals 
        SET goals_json = ?, completed_count = ?
        WHERE id = ?
      `).run(JSON.stringify(goals), completedCount, existing.id);
    } else {
      db.prepare(`
        INSERT INTO daily_goals (user_id, date, goals_json, completed_count, total_count)
        VALUES (?, ?, ?, ?, ?)
      `).run(req.user.id, today, JSON.stringify(goals), completedCount, totalCount);
    }

    const updated = db.prepare('SELECT * FROM daily_goals WHERE user_id = ? AND date = ?').get(req.user.id, today);
    res.json(updated);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// GET /goals/streak
router.get('/streak', auth, (req, res) => {
  try {
    const history = db.prepare('SELECT * FROM daily_goals WHERE user_id = ? ORDER BY date DESC LIMIT 30').all(req.user.id);
    
    let streak = 0;
    for (let g of history) {
      if (g.completed_count > 0) {
        streak++;
      } else {
        break;
      }
    }
    
    res.json({ streak, history });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
