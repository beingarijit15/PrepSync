const express = require('express');
const router = express.Router();
const db = require('../db/init');
const auth = require('../middleware/auth');

// POST /mock-interview/start
router.post('/start', auth, (req, res) => {
  try {
    const { type, company } = req.body;
    
    // Pre-built question banks
    let questions = [];
    if (type === 'technical') {
      questions = [
        "Explain the difference between a process and a thread in Operating Systems.",
        "How would you design a scalable URL shortener service?",
        "What is a binary search tree and what is its average and worst-case time complexity?"
      ];
    } else if (type === 'behavioral') {
      questions = [
        "Tell me about a time you faced a conflict in a team project and how you resolved it.",
        "What is your biggest weakness and what steps are you taking to improve it?",
        "Describe a situation where you had to take leadership under tight deadlines."
      ];
    } else {
      questions = [
        "Why do you want to join our company specifically?",
        "Where do you see yourself professionally in 3 to 5 years?",
        "How do you handle constructive criticism from team leads or peers?"
      ];
    }

    const interview = {
      type,
      company: company || 'General',
      questions,
      timestamp: new Date().toISOString()
    };
    
    res.json(interview);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// POST /mock-interview/submit
router.post('/submit', auth, (req, res) => {
  try {
    const { type, company, questions, answers } = req.body;
    
    let score = Math.floor(Math.random() * 30) + 70; // Score between 70 and 100
    
    const feedback = (answers || []).map((ans, i) => {
      let f = "Good attempt. Structure your response clearly using the STAR methodology (Situation, Task, Action, Result).";
      if (ans && ans.length > 50) f = "Excellent detailed answer! Well articulated with technical clarity.";
      if (!ans || ans.length < 20) f = "Answer is too brief. Try to elaborate with real project examples and trade-off analysis.";
      return { question: questions[i] || '', answer: ans || '', feedback: f };
    });

    const result = db.prepare(`
      INSERT INTO mock_interviews (user_id, type, company, questions_json, answers_json, feedback_json, score)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(req.user.id, type, company, JSON.stringify(questions), JSON.stringify(answers), JSON.stringify(feedback), score);

    const interviewId = result.lastInsertRowid;
    const interview = db.prepare('SELECT * FROM mock_interviews WHERE id = ? AND user_id = ?').get(interviewId, req.user.id);
    
    res.json(interview);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// GET /mock-interviews
router.get('/', auth, (req, res) => {
  try {
    const interviews = db.prepare('SELECT * FROM mock_interviews WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id);
    res.json(interviews);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// GET /mock-interview/:id
router.get('/:id', auth, (req, res) => {
  try {
    const interview = db.prepare('SELECT * FROM mock_interviews WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
    if (!interview) {
      return res.status(404).json({ error: 'Interview not found' });
    }
    res.json(interview);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
