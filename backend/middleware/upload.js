const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const uploadDir = path.join(__dirname, '..', 'uploads');
const submissionsDir = path.join(uploadDir, 'submissions');
const feedbackDir = path.join(uploadDir, 'feedback');

[uploadDir, submissionsDir, feedbackDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Use disk storage for development, memory storage for production (Render)
const storage = process.env.NODE_ENV === 'production' 
  ? multer.memoryStorage()
  : multer.diskStorage({
      destination: function (req, file, cb) {
        const dest = file.fieldname === 'feedbackFiles' ? feedbackDir : submissionsDir;
        cb(null, dest);
      },
      filename: function (req, file, cb) {
        const userId = req.user?._id || 'anonymous';
        const timestamp = Date.now();
        const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filename = `${timestamp}-${userId}-${sanitizedName}`;
        cb(null, filename);
      }
    });

const fileFilter = (req, file, cb) => {
  const allowed = [
    // Documents
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'text/csv',
    // Images
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/gif',
    'image/webp',
    // Archives
    'application/zip',
    'application/x-rar-compressed',
    // Code
    'text/html',
    'text/css',
    'text/javascript',
    'application/json',
    'text/x-python',
    'text/x-java',
    // Videos
    'video/mp4',
    'video/mpeg'
  ];
  
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('File type not allowed'), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: Number(process.env.MAX_FILE_SIZE) || 50 * 1024 * 1024, // 50MB
    files: 10 // Max 10 files
  },
  fileFilter
});

// Middleware for handling upload errors
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum size is 50MB.'
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Maximum is 10 files.'
      });
    }
    return res.status(400).json({
      success: false,
      message: `Upload error: ${err.message}`
    });
  }
  
  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  
  next();
};

// Helper to delete file
const deleteFile = (filePath) => {
  return new Promise((resolve) => {
    if (!filePath || process.env.NODE_ENV === 'production') return resolve();
    const fullPath = path.join(__dirname, '..', filePath);
    fs.unlink(fullPath, (err) => {
      if (err && err.code !== 'ENOENT') console.error('Error deleting file:', err);
      resolve();
    });
  });
};

module.exports = {
  upload,
  handleUploadError,
  deleteFile,
  uploadDir,
  submissionsDir,
  feedbackDir
};
