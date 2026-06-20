require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const loanRoutes = require('./routes/loanRoutes');

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/loans', loanRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'EMI Ledger server is running.' });
});

// Bind Port
const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
