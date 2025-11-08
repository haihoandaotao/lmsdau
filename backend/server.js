const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const courseRoutes = require('./routes/courses');
const assignmentRoutes = require('./routes/assignments');
const forumRoutes = require('./routes/forum');
const progressRoutes = require('./routes/progress');
const notificationRoutes = require('./routes/notifications');
const seedRoutes = require('./routes/seed');

// Initialize express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL?.split(',') || process.env.CLIENT_URL || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Static serving for potential future local storage (avoid in Render ephemeral FS)
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
// Serve setup page
app.use('/setup', express.static(path.join(__dirname, 'public')));

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Connection Error:', err));

// Socket.IO for real-time notifications
io.on('connection', (socket) => {
  console.log('New client connected');
  
  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined`);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Make io accessible to routes and globally
app.set('io', io);
global.io = io;

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/seed', seedRoutes);

// Serve static files from React app in production
if (process.env.NODE_ENV === 'production') {
  const frontendBuildPath = path.join(__dirname, '..', 'frontend', 'build');
  
  app.use(express.static(frontendBuildPath));
  
  // All non-API routes should serve the React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendBuildPath, 'index.html'));
  });
} else {
  // Health check for development
  app.get('/', (req, res) => {
    res.json({ message: 'LMS API is running' });
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = { app, io };
