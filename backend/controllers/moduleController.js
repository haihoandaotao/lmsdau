const Module = require('../models/Module');
const Course = require('../models/Course');
const VideoProgress = require('../models/VideoProgress');

// @desc    Get all modules for a course
// @route   GET /api/modules/course/:courseId
// @access  Private
exports.getCourseModules = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    // Check if user has access to course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy khóa học'
      });
    }
    
    // Check authorization
    const isEnrolled = course.enrolledStudents.includes(req.user.id);
    const isInstructor = course.instructor.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';
    const isTeacher = req.user.role === 'teacher';
    
    // Teachers and admins can manage any course, students need enrollment
    if (req.user.role === 'student' && !isEnrolled && !isInstructor && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Bạn chưa đăng ký khóa học này'
      });
    }
    
    // Get modules
    let query = { course: courseId };
    
    // Students only see published modules
    if (req.user.role === 'student') {
      query.isPublished = true;
    }
    
    const modules = await Module.find(query)
      .sort('order')
      .lean();
    
    // Get progress for each module item
    if (req.user.role === 'student') {
      for (const module of modules) {
        for (const item of module.items) {
          if (item.type === 'video') {
            const progress = await VideoProgress.findOne({
              user: req.user.id,
              itemId: item._id
            });
            
            if (progress) {
              item.progress = {
                currentTime: progress.currentTime,
                watchedPercentage: progress.watchedPercentage,
                isCompleted: progress.isCompleted
              };
            } else {
              item.progress = {
                currentTime: 0,
                watchedPercentage: 0,
                isCompleted: false
              };
            }
          }
        }
      }
    }
    
    res.status(200).json({
      success: true,
      count: modules.length,
      data: modules
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single module
// @route   GET /api/modules/:id
// @access  Private
exports.getModule = async (req, res) => {
  try {
    const module = await Module.findById(req.params.id)
      .populate('course', 'title code instructor');
    
    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy module'
      });
    }
    
    res.status(200).json({
      success: true,
      data: module
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create module
// @route   POST /api/modules
// @access  Private/Teacher/Admin
exports.createModule = async (req, res) => {
  try {
    const { course: courseId } = req.body;
    
    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy khóa học'
      });
    }
    
    // Check authorization
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền tạo module cho khóa học này'
      });
    }
    
    // Get next order number
    const maxOrder = await Module.findOne({ course: courseId })
      .sort('-order')
      .select('order');
    
    req.body.order = maxOrder ? maxOrder.order + 1 : 1;
    
    const module = await Module.create(req.body);
    
    res.status(201).json({
      success: true,
      data: module
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update module
// @route   PUT /api/modules/:id
// @access  Private/Teacher/Admin
exports.updateModule = async (req, res) => {
  try {
    let module = await Module.findById(req.params.id).populate('course');
    
    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy module'
      });
    }
    
    // Check authorization
    if (module.course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền chỉnh sửa module này'
      });
    }
    
    module = await Module.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: module
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete module
// @route   DELETE /api/modules/:id
// @access  Private/Teacher/Admin
exports.deleteModule = async (req, res) => {
  try {
    const module = await Module.findById(req.params.id).populate('course');
    
    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy module'
      });
    }
    
    // Check authorization
    if (module.course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền xóa module này'
      });
    }
    
    await module.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Add item to module
// @route   POST /api/modules/:id/items
// @access  Private/Teacher/Admin
exports.addModuleItem = async (req, res) => {
  try {
    const module = await Module.findById(req.params.id).populate('course');
    
    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy module'
      });
    }
    
    // Check authorization
    if (module.course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền thêm nội dung vào module này'
      });
    }
    
    // Set order
    const maxOrder = module.items.length > 0 
      ? Math.max(...module.items.map(item => item.order)) 
      : 0;
    req.body.order = maxOrder + 1;
    
    module.items.push(req.body);
    await module.save();
    
    res.status(201).json({
      success: true,
      data: module
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update module item
// @route   PUT /api/modules/:id/items/:itemId
// @access  Private/Teacher/Admin
exports.updateModuleItem = async (req, res) => {
  try {
    const module = await Module.findById(req.params.id).populate('course');
    
    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy module'
      });
    }
    
    // Check authorization
    if (module.course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền chỉnh sửa nội dung này'
      });
    }
    
    const item = module.items.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy nội dung'
      });
    }
    
    Object.assign(item, req.body);
    await module.save();
    
    res.status(200).json({
      success: true,
      data: module
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete module item
// @route   DELETE /api/modules/:id/items/:itemId
// @access  Private/Teacher/Admin
exports.deleteModuleItem = async (req, res) => {
  try {
    const module = await Module.findById(req.params.id).populate('course');
    
    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy module'
      });
    }
    
    // Check authorization
    if (module.course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền xóa nội dung này'
      });
    }
    
    module.items.pull(req.params.itemId);
    await module.save();
    
    res.status(200).json({
      success: true,
      data: module
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Reorder modules
// @route   PUT /api/modules/course/:courseId/reorder
// @access  Private/Teacher/Admin
exports.reorderModules = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { moduleOrders } = req.body; // [{ id, order }, ...]
    
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy khóa học'
      });
    }
    
    // Check authorization
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền sắp xếp lại modules'
      });
    }
    
    // Update orders
    const updatePromises = moduleOrders.map(({ id, order }) => 
      Module.findByIdAndUpdate(id, { order })
    );
    
    await Promise.all(updatePromises);
    
    res.status(200).json({
      success: true,
      message: 'Đã cập nhật thứ tự modules'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = exports;
