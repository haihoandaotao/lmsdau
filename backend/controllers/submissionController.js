const Submission = require('../models/Submission');
const Assignment = require('../models/Assignment');
const Course = require('../models/Course');
const { deleteFile } = require('../middleware/upload');
const path = require('path');

// @desc    Submit assignment
// @route   POST /api/submissions
// @access  Private (Student)
exports.submitAssignment = async (req, res) => {
  try {
    const { assignmentId, content } = req.body;
    const studentId = req.user._id;
    
    // Get assignment details
    const assignment = await Assignment.findById(assignmentId).populate('course');
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }
    
    // Check if student is enrolled
    const isEnrolled = req.user.enrolledCourses.some(c => 
      c.toString() === assignment.course._id.toString()
    );
    
    if (!isEnrolled) {
      return res.status(403).json({ 
        success: false, 
        message: 'You must be enrolled in this course to submit' 
      });
    }
    
    // Process uploaded files
    const files = req.files ? req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: file.path,
      url: `/uploads/submissions/${file.filename}`
    })) : [];
    
    // Check for existing submission
    let submission = await Submission.findOne({
      assignment: assignmentId,
      student: studentId
    });
    
    if (submission) {
      // Resubmission
      submission.resubmit(content, files);
      
      // Check if late
      if (assignment.dueDate) {
        submission.markAsLate(assignment.dueDate);
      }
      
      await submission.save();
      
      return res.json({
        success: true,
        message: 'Assignment resubmitted successfully',
        data: submission
      });
    }
    
    // New submission
    submission = await Submission.create({
      assignment: assignmentId,
      student: studentId,
      course: assignment.course._id,
      content,
      files,
      submittedAt: new Date()
    });
    
    // Check if late
    if (assignment.dueDate) {
      submission.markAsLate(assignment.dueDate);
      await submission.save();
    }
    
    res.status(201).json({
      success: true,
      message: 'Assignment submitted successfully',
      data: submission
    });
  } catch (error) {
    console.error('Error submitting assignment:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error submitting assignment',
      error: error.message
    });
  }
};

// @desc    Get assignment submissions (teacher view)
// @route   GET /api/submissions/assignment/:assignmentId
// @access  Private (Teacher/Admin)
exports.getAssignmentSubmissions = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    
    // Verify assignment exists and user has access
    const assignment = await Assignment.findById(assignmentId).populate('course');
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }
    
    // Get all submissions
    const submissions = await Submission.find({ assignment: assignmentId })
      .populate('student', 'name email')
      .populate('gradedBy', 'name')
      .sort({ submittedAt: -1 });
    
    // Get submission statistics
    const stats = await Submission.getSubmissionStats(assignmentId);
    
    // Get enrolled students count
    const course = await Course.findById(assignment.course._id);
    const totalStudents = course.students.length;
    const notSubmitted = totalStudents - stats.total;
    
    res.json({
      success: true,
      data: {
        submissions,
        stats: {
          ...stats,
          totalStudents,
          notSubmitted
        },
        assignment: {
          _id: assignment._id,
          title: assignment.title,
          dueDate: assignment.dueDate,
          maxGrade: assignment.maxGrade
        }
      }
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get student's submission
// @route   GET /api/submissions/assignment/:assignmentId/my-submission
// @access  Private (Student)
exports.getMySubmission = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const studentId = req.user._id;
    
    const submission = await Submission.findOne({
      assignment: assignmentId,
      student: studentId
    }).populate('assignment', 'title dueDate maxGrade')
      .populate('gradedBy', 'name');
    
    if (!submission) {
      return res.json({
        success: true,
        data: null,
        message: 'No submission found'
      });
    }
    
    res.json({
      success: true,
      data: submission
    });
  } catch (error) {
    console.error('Error fetching submission:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get all submissions for a student in a course
// @route   GET /api/submissions/course/:courseId/my-submissions
// @access  Private (Student)
exports.getMySubmissions = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user._id;
    
    const submissions = await Submission.getStudentSubmissions(studentId, courseId);
    
    res.json({
      success: true,
      data: submissions
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Grade submission
// @route   POST /api/submissions/:id/grade
// @access  Private (Teacher/Admin)
exports.gradeSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const { grade, maxGrade, feedback, rubricScores } = req.body;
    
    const submission = await Submission.findById(id);
    if (!submission) {
      return res.status(404).json({ success: false, message: 'Submission not found' });
    }
    
    // Process feedback files if any
    const feedbackFiles = req.files ? req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: file.path,
      url: `/uploads/feedback/${file.filename}`
    })) : [];
    
    // Add grade to submission (also creates gradebook entry)
    await submission.addGrade({
      grade: Number(grade),
      maxGrade: Number(maxGrade),
      feedback,
      rubricScores,
      feedbackFiles,
      gradedBy: req.user._id
    });
    
    await submission.populate('student', 'name email');
    await submission.populate('gradedBy', 'name');
    
    res.json({
      success: true,
      message: 'Submission graded successfully',
      data: submission
    });
  } catch (error) {
    console.error('Error grading submission:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error grading submission',
      error: error.message
    });
  }
};

// @desc    Bulk grade submissions
// @route   POST /api/submissions/bulk-grade
// @access  Private (Teacher/Admin)
exports.bulkGradeSubmissions = async (req, res) => {
  try {
    const { grades } = req.body; // Array of {submissionId, grade, feedback}
    
    if (!Array.isArray(grades) || grades.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Grades array is required'
      });
    }
    
    const results = [];
    
    for (const gradeData of grades) {
      try {
        const submission = await Submission.findById(gradeData.submissionId);
        if (!submission) {
          results.push({
            submissionId: gradeData.submissionId,
            success: false,
            error: 'Submission not found'
          });
          continue;
        }
        
        await submission.addGrade({
          grade: Number(gradeData.grade),
          maxGrade: Number(gradeData.maxGrade),
          feedback: gradeData.feedback,
          gradedBy: req.user._id
        });
        
        results.push({
          submissionId: gradeData.submissionId,
          success: true
        });
      } catch (error) {
        results.push({
          submissionId: gradeData.submissionId,
          success: false,
          error: error.message
        });
      }
    }
    
    res.json({
      success: true,
      message: `Graded ${results.filter(r => r.success).length} of ${results.length} submissions`,
      data: results
    });
  } catch (error) {
    console.error('Error bulk grading:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Delete submission
// @route   DELETE /api/submissions/:id
// @access  Private (Student - own only, Teacher/Admin - all)
exports.deleteSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    
    const submission = await Submission.findById(id);
    if (!submission) {
      return res.status(404).json({ success: false, message: 'Submission not found' });
    }
    
    // Check permissions
    if (req.user.role === 'student' && submission.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'You can only delete your own submissions' 
      });
    }
    
    // Delete associated files
    if (submission.files && submission.files.length > 0) {
      for (const file of submission.files) {
        await deleteFile(file.path);
      }
    }
    
    await submission.deleteOne();
    
    res.json({
      success: true,
      message: 'Submission deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting submission:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Download submission file
// @route   GET /api/submissions/download/:submissionId/:filename
// @access  Private
exports.downloadFile = async (req, res) => {
  try {
    const { submissionId, filename } = req.params;
    
    const submission = await Submission.findById(submissionId);
    if (!submission) {
      return res.status(404).json({ success: false, message: 'Submission not found' });
    }
    
    // Check permissions
    const isOwner = submission.student.toString() === req.user._id.toString();
    const isTeacher = req.user.role === 'teacher' || req.user.role === 'admin';
    
    if (!isOwner && !isTeacher) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied' 
      });
    }
    
    // Find file
    const file = submission.files.find(f => f.filename === filename);
    if (!file) {
      return res.status(404).json({ success: false, message: 'File not found' });
    }
    
    const filePath = path.join(__dirname, '..', file.path);
    res.download(filePath, file.originalName);
  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(500).json({ success: false, message: 'Error downloading file' });
  }
};
