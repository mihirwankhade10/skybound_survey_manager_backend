const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const swaggerDocs = require('./config/swagger');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Initialize express
const app = express();

// Middleware
// Configure CORS to allow requests from your frontend
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', '*'], // Add your frontend URL here
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());
app.use(express.json({ extended: false }));

// Import routes
const authRoutes = require('./routes/auth');
const missionRoutes = require('./routes/missions');
const droneRoutes = require('./routes/drones');
const monitorRoutes = require('./routes/monitor');
const reportRoutes = require('./routes/reports');

// Define routes
app.use('/api/auth', authRoutes);
app.use('/api/missions', missionRoutes);
app.use('/api/drones', droneRoutes);
app.use('/api/monitor', monitorRoutes);
app.use('/api/reports', reportRoutes);

// Base route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Skybound Survey API' });
});

// Define PORT
const PORT = process.env.PORT || 5000;

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  // Initialize Swagger docs
  swaggerDocs(app);
});

// For testing purposes
module.exports = app;
