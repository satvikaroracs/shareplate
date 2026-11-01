
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Reuse the MongoDB connection across warm Vercel invocations.
const cached = global.mongooseCache || {
  conn: null,
  promise: null
};

global.mongooseCache = cached;

async function connectDB() {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not configured');
  }

  // Return an already established connection.
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  // Clear a stale connection promise if MongoDB disconnected.
  if (mongoose.connection.readyState === 0) {
    cached.conn = null;
    cached.promise = null;
  }

  // Start only one connection attempt at a time.
  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 15000
    })
      .then((connection) => {
        console.log('Connected to MongoDB');
        return connection;
      })
      .catch((error) => {
        cached.promise = null;
        cached.conn = null;
        throw error;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

// Make sure every API request waits for the database.
app.use('/api', (req, res, next) => {
  connectDB()
    .then(() => next())
    .catch((error) => {
      console.error('DB connection failed:', error.message);

      res.status(503).json({
        message: 'Database temporarily unavailable. Please try again.'
      });
    });
});

// Existing API routes — unchanged.
app.use('/api/auth', require('./routes/auth'));
app.use('/api/donations', require('./routes/donations'));

// Run a local server only outside production.
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 3000;

  app.listen(port, () => {
    console.log(`SharePlate running at http://localhost:${port}`);
  });
}

module.exports = app;
