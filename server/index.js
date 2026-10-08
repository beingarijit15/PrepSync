require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const clientDistPath = path.join(__dirname, '..', 'client', 'dist');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Serve static files for uploads if needed in future
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/progress', require('./routes/progress'));
app.use('/api/mock-interview', require('./routes/interview'));
app.use('/api/resume', require('./routes/resume'));
app.use('/api/goals', require('./routes/goals'));
app.use('/api/companies', require('./routes/companies'));

// Serve the Vite build from the same origin as the API.
app.use(express.static(clientDistPath));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return next();
  }
  res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
    if (err) next(err);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!', details: err.message });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
