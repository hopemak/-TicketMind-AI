const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const ticketRoutes = require('./routes/tickets');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Mount our functional pipelines explicitly
app.use('/api/tickets', ticketRoutes);
app.use('/api/analytics', analyticsRoutes);

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/geda';
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected successfully to instance [geda]'))
  .catch(err => console.error('Database connection fault:', err));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Environment: development');
});
