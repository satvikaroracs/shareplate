require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/donations', require('./routes/donations'));

// Only connect to DB & listen when running locally (not on Vercel)
if (process.env.NODE_ENV !== 'production') {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      const port = process.env.PORT || 3000;
      app.listen(port, () =>
        console.log('SharePlate running at http://localhost:' + port)
      );
    })
    .catch((err) => console.error('DB connection failed:', err.message));
}

// This line is what Vercel needs:
module.exports = app;
