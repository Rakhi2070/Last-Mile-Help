// server.js

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

dotenv.config();

const app = express();

// ✅ Step 1: Allow cross-origin requests (from mobile or other IPs)
app.use(cors({
  origin: "https://last-mile-help.vercel.app", // In production, set this to your frontend domain
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// ✅ Step 2: Serve uploads (photos/documents)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Step 3: API Routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

const adminRoutes = require('./routes/adminRoutes');
app.use('/api/admins', adminRoutes);

// ✅ Step 4: Test route
app.get('/', (req, res) => {
  res.send('🌐 Backend API is running...');
});

// ✅ Step 5: Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('✅ MongoDB Connected');

    const PORT = process.env.PORT || 5000;

    // ✅ Step 6: Start server on all network interfaces
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err));
