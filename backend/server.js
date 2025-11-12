const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

const authRoutes = require('./routes/authroutes');
const articleRoutes = require('./routes/articleroutes');

const app = express();
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || '*'
}));

connectDB();
app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);


const PORT = process.env.PORT || 7000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
