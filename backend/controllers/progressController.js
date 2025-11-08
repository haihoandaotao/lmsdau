const Course = require('../models/Course');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const User = require('../models/User');

// @desc    Get student progress
// @route   GET /api/progress/student/:id
// @access  Private
exports.getStudentProgress = async (req, res) => {
  try {
    const studentId = req.params.id;

    // Verify authorization
    if (req.user.id !== studentId && req.user.role !== 'admin' && req.user.role !== 'teacher') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this progress'
      });
    }

    const student = await User.findById(studentId)
      .populate('enrolledCourses', 'title code credits');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Get all submissions for the student
    const submissions = await Submission.find({ student: studentId })
      .populate({
        path: 'assignment',
        populate: { path: 'course', select: 'title code' }
      });

    // Calculate progress for each course
    const courseProgress = [];
    
    for (const course of student.enrolledCourses) {
      const courseAssignments = await Assignment.find({ course: course._id });
      const courseSubmissions = submissions.filter(
        sub => sub.assignment.course._id.toString() === course._id.toString()
      );

      const totalAssignments = courseAssignments.length;
      const completedAssignments = courseSubmissions.length;
      const totalPoints = courseAssignments.reduce((sum, a) => sum + a.totalPoints, 0);
      const earnedPoints = courseSubmissions.reduce((sum, s) => sum + s.score, 0);

      const completionRate = totalAssignments > 0 
        ? (completedAssignments / totalAssignments) * 100 
        : 0;
      
      const averageGrade = totalPoints > 0 
        ? (earnedPoints / totalPoints) * 100 
        : 0;

      courseProgress.push({
        course: {
          _id: course._id,
          title: course.title,
          code: course.code,
          credits: course.credits
        },
        totalAssignments,
        completedAssignments,
        completionRate: completionRate.toFixed(2),
        totalPoints,
        earnedPoints,
        averageGrade: averageGrade.toFixed(2),
        gradeStatus: getGradeStatus(averageGrade)
      });
    }

    // Overall statistics
    const totalCourses = student.enrolledCourses.length;
    const totalSubmissions = submissions.length;
    const totalAssignmentsAcrossAllCourses = await Assignment.countDocuments({
      course: { $in: student.enrolledCourses.map(c => c._id) }
    });
    
    const overallCompletion = totalAssignmentsAcrossAllCourses > 0
      ? (totalSubmissions / totalAssignmentsAcrossAllCourses) * 100
      : 0;

    const overallAverage = courseProgress.length > 0
      ? courseProgress.reduce((sum, cp) => sum + parseFloat(cp.averageGrade), 0) / courseProgress.length
      : 0;

    res.status(200).json({
      success: true,
      data: {
        student: {
          _id: student._id,
          name: student.name,
          email: student.email,
          studentId: student.studentId,
          department: student.department
        },
        overview: {
          totalCourses,
          totalAssignments: totalAssignmentsAcrossAllCourses,
          completedAssignments: totalSubmissions,
          overallCompletion: overallCompletion.toFixed(2),
          overallAverage: overallAverage.toFixed(2),
          gradeStatus: getGradeStatus(overallAverage)
        },
        courseProgress
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get course statistics
// @route   GET /api/progress/course/:id
// @access  Private/Teacher/Admin
exports.getCourseStatistics = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name email')
      .populate('enrolledStudents', 'name email studentId');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Verify authorization
    if (course.instructor._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view course statistics'
      });
    }

    // Get all assignments for the course
    const assignments = await Assignment.find({ course: req.params.id });
    
    // Get all submissions for the course
    const submissions = await Submission.find({
      assignment: { $in: assignments.map(a => a._id) }
    }).populate('student', 'name email studentId');

    // Calculate statistics
    const totalStudents = course.enrolledStudents.length;
    const totalAssignments = assignments.length;
    const totalSubmissions = submissions.length;
    
    const averageSubmissionRate = totalAssignments > 0 && totalStudents > 0
      ? (totalSubmissions / (totalAssignments * totalStudents)) * 100
      : 0;

    const gradedSubmissions = submissions.filter(s => s.status === 'graded');
    const averageScore = gradedSubmissions.length > 0
      ? gradedSubmissions.reduce((sum, s) => {
          const assignment = assignments.find(a => a._id.toString() === s.assignment.toString());
          return sum + (s.score / assignment.totalPoints) * 100;
        }, 0) / gradedSubmissions.length
      : 0;

    // Student performance
    const studentPerformance = course.enrolledStudents.map(student => {
      const studentSubmissions = submissions.filter(
        s => s.student._id.toString() === student._id.toString()
      );
      
      const completedAssignments = studentSubmissions.length;
      const completionRate = totalAssignments > 0
        ? (completedAssignments / totalAssignments) * 100
        : 0;

      const gradedStudentSubmissions = studentSubmissions.filter(s => s.status === 'graded');
      const studentAverage = gradedStudentSubmissions.length > 0
        ? gradedStudentSubmissions.reduce((sum, s) => {
            const assignment = assignments.find(a => a._id.toString() === s.assignment.toString());
            return sum + (s.score / assignment.totalPoints) * 100;
          }, 0) / gradedStudentSubmissions.length
        : 0;

      return {
        student: {
          _id: student._id,
          name: student.name,
          email: student.email,
          studentId: student.studentId
        },
        completedAssignments,
        totalAssignments,
        completionRate: completionRate.toFixed(2),
        averageGrade: studentAverage.toFixed(2),
        gradeStatus: getGradeStatus(studentAverage)
      };
    });

    // Assignment statistics
    const assignmentStats = assignments.map(assignment => {
      const assignmentSubmissions = submissions.filter(
        s => s.assignment.toString() === assignment._id.toString()
      );
      
      const submissionRate = totalStudents > 0
        ? (assignmentSubmissions.length / totalStudents) * 100
        : 0;

      const gradedAssignmentSubmissions = assignmentSubmissions.filter(s => s.status === 'graded');
      const assignmentAverage = gradedAssignmentSubmissions.length > 0
        ? gradedAssignmentSubmissions.reduce((sum, s) => sum + (s.score / assignment.totalPoints) * 100, 0) / gradedAssignmentSubmissions.length
        : 0;

      return {
        assignment: {
          _id: assignment._id,
          title: assignment.title,
          type: assignment.type,
          totalPoints: assignment.totalPoints,
          dueDate: assignment.dueDate
        },
        totalSubmissions: assignmentSubmissions.length,
        submissionRate: submissionRate.toFixed(2),
        gradedSubmissions: gradedAssignmentSubmissions.length,
        averageScore: assignmentAverage.toFixed(2)
      };
    });

    res.status(200).json({
      success: true,
      data: {
        course: {
          _id: course._id,
          title: course.title,
          code: course.code,
          instructor: course.instructor
        },
        overview: {
          totalStudents,
          totalAssignments,
          totalSubmissions,
          averageSubmissionRate: averageSubmissionRate.toFixed(2),
          averageScore: averageScore.toFixed(2)
        },
        studentPerformance,
        assignmentStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get dashboard overview
// @route   GET /api/progress/dashboard
// @access  Private
exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    let dashboardData = {};

    if (userRole === 'student') {
      // Student dashboard
      const student = await User.findById(userId).populate('enrolledCourses');
      const submissions = await Submission.find({ student: userId });
      const assignments = await Assignment.find({
        course: { $in: student.enrolledCourses.map(c => c._id) }
      });

      const upcomingAssignments = assignments
        .filter(a => new Date(a.dueDate) > new Date())
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 5);

      const recentSubmissions = submissions
        .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
        .slice(0, 5);

      dashboardData = {
        totalCourses: student.enrolledCourses.length,
        totalAssignments: assignments.length,
        completedAssignments: submissions.length,
        pendingAssignments: assignments.length - submissions.length,
        upcomingAssignments,
        recentSubmissions
      };

    } else if (userRole === 'teacher') {
      // Teacher dashboard
      const teacher = await User.findById(userId).populate('teachingCourses');
      const courses = teacher.teachingCourses;
      
      const assignments = await Assignment.find({
        course: { $in: courses.map(c => c._id) }
      });

      const submissions = await Submission.find({
        assignment: { $in: assignments.map(a => a._id) },
        status: 'submitted'
      });

      const totalStudents = courses.reduce((sum, c) => sum + c.enrolledStudents.length, 0);

      dashboardData = {
        totalCourses: courses.length,
        totalStudents,
        totalAssignments: assignments.length,
        pendingGrading: submissions.length,
        courses: courses.map(c => ({
          _id: c._id,
          title: c.title,
          code: c.code,
          enrolledStudents: c.enrolledStudents.length
        }))
      };

    } else if (userRole === 'admin') {
      // Admin dashboard
      const totalUsers = await User.countDocuments();
      const totalStudents = await User.countDocuments({ role: 'student' });
      const totalTeachers = await User.countDocuments({ role: 'teacher' });
      const totalCourses = await Course.countDocuments();
      const totalAssignments = await Assignment.countDocuments();
      const activeCourses = await Course.countDocuments({ isActive: true });

      dashboardData = {
        totalUsers,
        totalStudents,
        totalTeachers,
        totalCourses,
        activeCourses,
        totalAssignments
      };
    }

    res.status(200).json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Helper function to determine grade status
function getGradeStatus(grade) {
  if (grade >= 90) return 'Excellent';
  if (grade >= 80) return 'Good';
  if (grade >= 70) return 'Average';
  if (grade >= 60) return 'Below Average';
  return 'Poor';
}
