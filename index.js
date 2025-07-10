// Mini URL Shortener - Express + PostgreSQL
// (Yeah, could split this up into more files, but it's a small project!)
require('dotenv').config();

const express = require('express');
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const validUrl = require('valid-url');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// --- DB setup ---
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Just to check if DB is up when we start
pool.connect((err, client, release) => {
  if (err) {
    console.error('DB connection error:', err.stack);
  } else {
    console.log('PostgreSQL is up!');
    release();
  }
});

// --- In-memory rate limiter (not perfect, but works for demo) ---
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 min
const RATE_LIMIT_MAX = 5;
const ipHits = {};
function rateLimiter(req, res, next) {
  const ip = req.ip;
  const now = Date.now();
  if (!ipHits[ip]) ipHits[ip] = [];
  ipHits[ip] = ipHits[ip].filter(ts => now - ts < RATE_LIMIT_WINDOW);
  if (ipHits[ip].length >= RATE_LIMIT_MAX) {
    // Too many requests, chill out!
    return res.status(429).json({ error: 'Whoa, slow down! (rate limit)' });
  }
  ipHits[ip].push(now);
  next();
}

// --- Home page (just serves the UI) ---
app.get('/', (req, res) => {
  // Could render a template, but static HTML is fine for now
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// --- Shorten URL ---
app.post('/shorten', rateLimiter, async (req, res) => {
  const { url } = req.body;
  if (!url || !validUrl.isWebUri(url)) {
    // Not a valid URL, sorry!
    return res.status(400).json({ error: 'Please enter a valid URL.' });
  }
  const code = nanoid(6);
  try {
    // Check if we've already shortened this one
    const found = await pool.query('SELECT * FROM urls WHERE original_url = $1', [url]);
    if (found.rows.length > 0) {
      // Already exists, just return it
      return res.json({ shortUrl: `${BASE_URL}/${found.rows[0].short_code}` });
    }
    // Save new short URL
    await pool.query(
      'INSERT INTO urls (original_url, short_code) VALUES ($1, $2)',
      [url, code]
    );
    // Debug log (could remove later)
    console.log('Shortened:', url, '->', code);
    res.json({ shortUrl: `${BASE_URL}/${code}` });
  } catch (err) {
    // TODO: handle DB errors better (maybe show user-friendly message)
    console.error('Error in /shorten:', err);
    res.status(500).json({ error: 'Something went wrong, try again?' });
  }
});

// --- Redirect to original URL ---
app.get('/:code', async (req, res) => {
  const { code } = req.params;
  try {
    const result = await pool.query('SELECT * FROM urls WHERE short_code = $1', [code]);
    if (result.rows.length === 0) {
      // Not found, maybe typo?
      return res.status(404).json({ error: 'Short URL not found.' });
    }
    const urlRow = result.rows[0];
    // Expiry check
    if (urlRow.expires_at && new Date(urlRow.expires_at) < new Date()) {
      return res.status(410).json({ error: 'This link has expired.' });
    }
    // Count the click (not super important if it fails)
    pool.query('UPDATE urls SET click_count = click_count + 1 WHERE short_code = $1', [code])
      .catch(e => console.log('Click count update failed:', e));
    // Redirect!
    res.redirect(urlRow.original_url);
  } catch (err) {
    console.error('Error in redirect:', err);
    res.status(500).json({ error: 'Oops, server error.' });
  }
});

// --- API: Get all shortened URLs (for dashboard) ---
app.get('/api/urls', async (req, res) => {
  try {
    const result = await pool.query('SELECT original_url, short_code, click_count, expires_at, created_at FROM urls ORDER BY created_at DESC');
    res.json({ urls: result.rows });
  } catch (err) {
    console.error('Error fetching URLs:', err);
    res.status(500).json({ error: 'Could not fetch URLs' });
  }
});

// --- Start server ---
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  // Could add more startup checks here
});

// NOTE: Could refactor this into routes/controllers if it gets bigger! 