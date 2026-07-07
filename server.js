const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3005;
const ROOT = __dirname;

// Serve static files (index.html at /, plus /assets/* and /data/*)
app.use(express.static(ROOT));

// GET /api/reviews — returns reviews from data/reviews.json
app.get('/api/reviews', (req, res) => {
  const file = path.join(ROOT, 'data', 'reviews.json');
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
      console.warn('[warn] data/reviews.json missing or unreadable:', err.message);
      return res.status(200).json({ reviews: [] });
    }
    try {
      const parsed = JSON.parse(data);
      res.set('Content-Type', 'application/json; charset=utf-8');
      res.json({ reviews: parsed.reviews || [] });
    } catch (parseErr) {
      console.warn('[warn] data/reviews.json invalid JSON:', parseErr.message);
      res.status(200).json({ reviews: [] });
    }
  });
});

// 404 fallback for unknown API routes
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`\nRarama Living Studio`);
  console.log(`  Local:   http://localhost:${PORT}`);
  console.log(`  Network: http://0.0.0.0:${PORT}\n`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`[error] Port ${PORT} is already in use.`);
    console.error(`        Free the port, or run: PORT=3006 npm start`);
    process.exit(1);
  } else {
    console.error('[error] Server failed to start:', err);
    process.exit(1);
  }
});
