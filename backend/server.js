const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

// Load environment variables from backend/.env
dotenv.config({ path: path.join(__dirname, '.env') });

// Debug: Check if env is loaded
console.log('📝 MONGODB_URI:', process.env.MONGODB_URI ? 'Found (Atlas)' : 'NOT FOUND');
console.log('📝 PORT:', process.env.PORT);

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const courseRoutes = require('./routes/courses');
const assignmentRoutes = require('./routes/assignments');
const forumRoutes = require('./routes/forum');
const progressRoutes = require('./routes/progress');
const notificationRoutes = require('./routes/notifications');
const seedRoutes = require('./routes/seed');
const moduleRoutes = require('./routes/modules');
const videoProgressRoutes = require('./routes/videoProgress');
const gradeRoutes = require('./routes/grades');
const submissionRoutes = require('./routes/submissions');
const quizRoutes = require('./routes/quizzes');
const bookmarkRoutes = require('./routes/bookmarks');
const noteRoutes = require('./routes/notes');
const itemCompletionRoutes = require('./routes/itemCompletion');
const resourceRoutes = require('./routes/resources');
const majorRoutes = require('./routes/majors');
const curriculumRoutes = require('./routes/curriculums');

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
console.log('🔌 Connecting to MongoDB Atlas...');
console.log('URI:', process.env.MONGODB_URI);
mongoose.connect(process.env.MONGODB_URI)
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
app.use('/api/modules', moduleRoutes);
app.use('/api/video-progress', videoProgressRoutes);
app.use('/api/grades', gradeRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/item-completion', itemCompletionRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/majors', majorRoutes);
app.use('/api/curriculums', curriculumRoutes);

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
