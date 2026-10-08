const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../db/init');
const auth = require('../middleware/auth');

// Configure Multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Helper function to extract text from buffer (handles plain text & simple text formats)
function extractTextFromBuffer(buffer, filename) {
  try {
    const rawText = buffer.toString('utf8');
    // Sanitize non-printable characters if needed
    const cleanText = rawText.replace(/[\x00-\x09\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, ' ');
    return cleanText;
  } catch (e) {
    return 'Extracted Resume File Content';
  }
}

// POST /resume/upload — Upload resume file directly
router.post('/upload', auth, upload.single('resumeFile'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No resume file uploaded' });
    }

    const fileText = extractTextFromBuffer(req.file.buffer, req.file.originalname);
    res.json({
      filename: req.file.originalname,
      size: req.file.size,
      text: fileText
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('File processing error');
  }
});

// POST /resume/analyze — Analyze resume text (or uploaded file content) against JD
router.post('/analyze', auth, upload.single('resumeFile'), (req, res) => {
  try {
    let resumeText = req.body.resumeText;
    const jobDescription = req.body.jobDescription;

    if (req.file) {
      resumeText = extractTextFromBuffer(req.file.buffer, req.file.originalname);
    }
    
    if (!resumeText || !jobDescription) {
      return res.status(400).json({ error: 'Please provide both resume text (or file) and job description' });
    }

    const commonSkills = [
      'Java', 'Python', 'C++', 'C', 'JavaScript', 'React', 'Node.js', 'Express', 'SQL', 
      'MongoDB', 'DBMS', 'OS', 'Networks', 'DSA', 'OOP', 'Git', 'Docker', 'AWS',
      'System Design', 'REST API', 'GraphQL', 'Tailwind', 'TypeScript', 'Linux',
      'Microservices', 'Kubernetes', 'CI/CD', 'PostgreSQL', 'Redis', 'Machine Learning'
    ];

    const lowerResume = resumeText.toLowerCase();
    const lowerJd = jobDescription.toLowerCase();

    const requiredSkills = commonSkills.filter(skill => lowerJd.includes(skill.toLowerCase()));
    const matchedSkills = requiredSkills.filter(skill => lowerResume.includes(skill.toLowerCase()));
    const missingSkills = requiredSkills.filter(skill => !lowerResume.includes(skill.toLowerCase()));

    let score = 50;
    if (requiredSkills.length > 0) {
      score = Math.round((matchedSkills.length / requiredSkills.length) * 100);
    } else {
      score = 78; // Default baseline score
    }

    const suggestions = [
      ...missingSkills.map(s => `Add practical project experience demonstrating ${s}`),
      "Quantify achievements with metrics (e.g. 'Improved database query performance by 35%')",
      "Include links to live GitHub repositories and deployed demo applications",
      "Highlight core computer science coursework (DSA, DBMS, OS, Computer Networks)"
    ];

    const analysis = {
      score,
      matchedSkills,
      missingSkills,
      suggestions,
      summary: `Your resume matches ${score}% of the target job requirements. Focus on adding ${missingSkills.slice(0, 3).join(', ')} to boost your match rating.`
    };

    const gaps = { missingSkills, missingKeywords: missingSkills };

    const result = db.prepare(`
      INSERT INTO resume_analyses (user_id, resume_text, job_description, analysis_json, gaps_json, score)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(req.user.id, resumeText, jobDescription, JSON.stringify(analysis), JSON.stringify(gaps), score);

    const analysisId = result.lastInsertRowid;
    const saved = db.prepare('SELECT * FROM resume_analyses WHERE id = ? AND user_id = ?').get(analysisId, req.user.id);

    res.json(saved);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// GET /resume/analyses
router.get('/analyses', auth, (req, res) => {
  try {
    const analyses = db.prepare('SELECT * FROM resume_analyses WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id);
    res.json(analyses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
