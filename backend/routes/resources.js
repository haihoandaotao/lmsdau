const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Resource = require('../models/Resource');
const auth = require('../middleware/auth');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/resources');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Create unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter to allow only certain file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'image/jpeg',
    'image/png',
    'image/gif',
    'video/mp4',
    'video/quicktime'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('File type not supported. Allowed: PDF, DOC, DOCX, PPT, PPTX, Images, Videos'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

// @route   POST /api/resources/upload
// @desc    Upload a resource file (PDF, document, etc.)
// @access  Private (Teacher/Admin)
router.post('/upload', auth, upload.single('file'), async (req, res) => {
  try {
    // Check if user is teacher or admin
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
      // Delete uploaded file if not authorized
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(403).json({
        success: false,
        message: 'Chỉ giáo viên và quản trị viên mới có thể upload tài nguyên'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng chọn file để upload'
      });
    }

    const { name, description, courseId, moduleId, itemId, tags } = req.body;

    if (!name || !courseId) {
      // Delete uploaded file if required data missing
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        message: 'Tên tài nguyên và ID khóa học là bắt buộc'
      });
    }

    // Determine resource type from mime type
    let resourceType = 'other';
    if (req.file.mimetype.includes('pdf')) {
      resourceType = 'pdf';
    } else if (req.file.mimetype.includes('image')) {
      resourceType = 'image';
    } else if (req.file.mimetype.includes('video')) {
      resourceType = 'video';
    } else if (req.file.mimetype.includes('document') || req.file.mimetype.includes('word')) {
      resourceType = 'document';
    }

    // Create resource URL (relative path)
    const fileUrl = `/uploads/resources/${req.file.filename}`;

    const resource = new Resource({
      name,
      description,
      type: resourceType,
      fileUrl,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      uploadedBy: req.user.id,
      course: courseId,
      module: moduleId || null,
      item: itemId || null,
      tags: tags ? JSON.parse(tags) : []
    });

    await resource.save();

    await resource.populate('uploadedBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Upload tài nguyên thành công',
      data: resource
    });

  } catch (error) {
    console.error('Upload error:', error);
    
    // Delete uploaded file if database save failed
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi upload tài nguyên'
    });
  }
});

// @route   GET /api/resources/course/:courseId
// @desc    Get all resources for a course
// @access  Private
router.get('/course/:courseId', auth, async (req, res) => {
  try {
    const resources = await Resource.find({ course: req.params.courseId })
      .populate('uploadedBy', 'name email')
      .populate('module', 'title')
      .sort('-createdAt');

    res.json({
      success: true,
      data: resources
    });
  } catch (error) {
    console.error('Get resources error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách tài nguyên'
    });
  }
});

// @route   GET /api/resources/module/:moduleId
// @desc    Get all resources for a module
// @access  Private
router.get('/module/:moduleId', auth, async (req, res) => {
  try {
    const resources = await Resource.find({ module: req.params.moduleId })
      .populate('uploadedBy', 'name email')
      .sort('-createdAt');

    res.json({
      success: true,
      data: resources
    });
  } catch (error) {
    console.error('Get module resources error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy tài nguyên của module'
    });
  }
});

// @route   GET /api/resources/:id
// @desc    Get a single resource
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id)
      .populate('uploadedBy', 'name email')
      .populate('module', 'title')
      .populate('course', 'title');

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy tài nguyên'
      });
    }

    res.json({
      success: true,
      data: resource
    });
  } catch (error) {
    console.error('Get resource error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin tài nguyên'
    });
  }
});

// @route   DELETE /api/resources/:id
// @desc    Delete a resource
// @access  Private (Teacher/Admin who uploaded it)
router.delete('/:id', auth, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy tài nguyên'
      });
    }

    // Check if user is the uploader or admin
    if (resource.uploadedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền xóa tài nguyên này'
      });
    }

    // Delete file from filesystem
    const filePath = path.join(__dirname, '..', resource.fileUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Resource.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Xóa tài nguyên thành công'
    });
  } catch (error) {
    console.error('Delete resource error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa tài nguyên'
    });
  }
});

// @route   PUT /api/resources/:id/download
// @desc    Increment download count
// @access  Private
router.put('/:id/download', auth, async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(
      req.params.id,
      { $inc: { downloadCount: 1 } },
      { new: true }
    );

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy tài nguyên'
      });
    }

    res.json({
      success: true,
      data: resource
    });
  } catch (error) {
    console.error('Update download count error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật số lượt tải'
    });
  }
});

// @route   PUT /api/resources/:id
// @desc    Update resource metadata
// @access  Private (Teacher/Admin who uploaded it)
router.put('/:id', auth, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy tài nguyên'
      });
    }

    // Check permission
    if (resource.uploadedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền chỉnh sửa tài nguyên này'
      });
    }

    const { name, description, tags, isPublic } = req.body;

    if (name) resource.name = name;
    if (description) resource.description = description;
    if (tags) resource.tags = tags;
    if (typeof isPublic !== 'undefined') resource.isPublic = isPublic;

    await resource.save();

    await resource.populate('uploadedBy', 'name email');

    res.json({
      success: true,
      message: 'Cập nhật tài nguyên thành công',
      data: resource
    });
  } catch (error) {
    console.error('Update resource error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật tài nguyên'
    });
  }
});

module.exports = router;
