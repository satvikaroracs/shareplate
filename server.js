require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// CONNECT TO DATABASE (both local AND Vercel — this was the bug, now fixed)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('DB connection failed:', err.message));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/donations', require('./routes/donations'));

// Only start a local listener when NOT on Vercel
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 3000;
  app.listen(port, () =>
    console.log('SharePlate running at http://localhost:' + port)
  );
}

module.exports = app;
