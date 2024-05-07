const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const imageRoutes = require('./routes/imageRoutes');
const domainRoutes = require('./routes/domainRoutes');
const classRoutes = require('./routes/classRoutes');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.DB_CONNECTION_STRING)
.then(() => console.log('MongoDB connected'))
.catch((error) => console.error('MongoDB connection error:', error));

app.use('/api/auth', authRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/domain', domainRoutes);
app.use('/api/class', classRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
