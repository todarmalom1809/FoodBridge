require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
let mongoConnection;

app.use(cors({
  origin: [
    'https://food-bridge-3k5m.vercel.app',
    'https://food-bridge-3k5m-fefecp2ti-todarmalom388-3750.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.use('/api', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI is not configured');
      }

      if (!mongoConnection || mongoose.connection.readyState === 0) {
        mongoConnection = mongoose.connect(process.env.MONGO_URI, {
          serverSelectionTimeoutMS: 10000,
        }).catch(err => {
          mongoConnection = null;
          throw err;
        });
      }

      await mongoConnection;
    }

    next();
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    res.status(503).json({ message: 'Database is unavailable. Check MongoDB configuration and network access.' });
  }
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/donations', require('./routes/donations'));
app.use('/api/requests', require('./routes/requests'));
app.use('/api/users', require('./routes/users'));

module.exports = app;

