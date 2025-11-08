const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Course = require('../models/Course');
const Assignment = require('../models/Assignment');
const ForumPost = require('../models/ForumPost');
const Module = require('../models/Module');
const { sampleModules } = require('../seeders/moduleSeeder');

// @route   POST /api/seed/init
// @desc    Seed database with initial data (ONLY for development/demo)
// @access  Public (should be protected in real production)
router.post('/init', async (req, res) => {
  try {
    // Check if users already exist
    const existingUsers = await User.countDocuments();
    if (existingUsers > 0) {
      return res.status(400).json({ 
        success: false,
        message: `Database already has ${existingUsers} users. Clear database first if you want to re-seed.` 
      });
    }

    console.log('🌱 Starting database seed...');

    // Clear existing data
    await User.deleteMany({});
    await Course.deleteMany({});
    await Assignment.deleteMany({});
    await ForumPost.deleteMany({});

    // Create users - password will be auto-hashed by User model's pre-save hook
    const users = await User.create([
      {
        name: 'GV. Nguyễn Văn An',
        email: 'giaovien@dau.edu.vn',
        password: '123456',
        role: 'teacher',
        department: 'Khoa Công nghệ Thông tin'
      },
      {
        name: 'GV. Trần Thị Bình',
        email: 'gvbinh@dau.edu.vn',
        password: '123456',
        role: 'teacher',
        department: 'Khoa Kiến trúc'
      },
      {
        name: 'Phạm Minh Tuấn',
        email: 'student1@dau.edu.vn',
        password: '123456',
        role: 'student',
        studentId: 'SV001',
        major: 'Công nghệ Thông tin'
      },
      {
        name: 'Lê Thị Hương',
        email: 'student2@dau.edu.vn',
        password: '123456',
        role: 'student',
        studentId: 'SV002',
        major: 'Kiến trúc'
      },
      {
        name: 'Võ Đức Anh',
        email: 'student3@dau.edu.vn',
        password: '123456',
        role: 'student',
        studentId: 'SV003',
        major: 'Công nghệ Thông tin'
      }
    ]);

    console.log(`✅ Created ${users.length} users`);

    // Create courses
    const courses = await Course.create([
      {
        code: 'IT101',
        title: 'Lập trình cơ bản',
        description: 'Khóa học giới thiệu về lập trình với Python',
        instructor: users[0]._id,
        department: 'Công nghệ Thông tin',
        credits: 3,
        year: 1,
        semester: 1,
        schedule: 'Thứ 2, 4 (7:00-9:00)',
        students: [users[2]._id, users[4]._id]
      },
      {
        code: 'IT201',
        title: 'Cấu trúc dữ liệu và Giải thuật',
        description: 'Học về các cấu trúc dữ liệu và thuật toán cơ bản',
        instructor: users[0]._id,
        department: 'Công nghệ Thông tin',
        credits: 4,
        year: 2,
        semester: 1,
        schedule: 'Thứ 3, 5 (9:00-11:00)',
        students: [users[2]._id, users[4]._id]
      },
      {
        code: 'AR301',
        title: 'Thiết kế Kiến trúc',
        description: 'Nguyên lý và kỹ thuật thiết kế kiến trúc hiện đại',
        instructor: users[1]._id,
        department: 'Kiến trúc',
        credits: 4,
        year: 3,
        semester: 1,
        schedule: 'Thứ 2, 4, 6 (13:00-16:00)',
        students: [users[3]._id]
      },
      {
        code: 'CE201',
        title: 'Kỹ thuật Xây dựng',
        description: 'Các kỹ thuật và phương pháp xây dựng công trình',
        instructor: users[1]._id,
        department: 'Xây dựng',
        credits: 3,
        year: 2,
        semester: 1,
        schedule: 'Thứ 3, 5 (7:00-9:00)',
        students: []
      },
      {
        code: 'EN101',
        title: 'Tiếng Anh chuyên ngành',
        description: 'Tiếng Anh chuyên ngành Kiến trúc và Xây dựng',
        instructor: users[0]._id,
        department: 'Ngoại ngữ',
        credits: 2,
        year: 1,
        semester: 1,
        schedule: 'Thứ 6 (15:00-17:00)',
        students: [users[2]._id, users[3]._id, users[4]._id]
      }
    ]);

    console.log(`✅ Created ${courses.length} courses`);

    // Create assignments
    const assignments = await Assignment.create([
      {
        title: 'Bài tập 1: Hello World',
        description: 'Viết chương trình Hello World bằng Python',
        course: courses[0]._id,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        totalPoints: 10
      },
      {
        title: 'Bài tập 2: Cấu trúc dữ liệu Stack',
        description: 'Cài đặt Stack sử dụng mảng và danh sách liên kết',
        course: courses[1]._id,
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        totalPoints: 20
      },
      {
        title: 'Đồ án: Thiết kế nhà ở',
        description: 'Thiết kế bản vẽ nhà ở 2 tầng theo tiêu chuẩn Việt Nam',
        course: courses[2]._id,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        totalPoints: 100
      }
    ]);

    console.log(`✅ Created ${assignments.length} assignments`);

    // Create forum posts
    const forumPosts = await ForumPost.create([
      {
        title: 'Chào mừng các bạn đến với khóa học!',
        content: 'Đây là diễn đàn để các bạn trao đổi, học hỏi lẫn nhau. Hãy thoải mái đặt câu hỏi nhé!',
        author: users[0]._id,
        course: courses[0]._id,
        category: 'announcement',
        comments: [
          {
            author: users[2]._id,
            content: 'Cảm ơn thầy! Em rất mong chờ khóa học này.',
            createdAt: new Date()
          }
        ]
      },
      {
        title: 'Câu hỏi về thuật toán sắp xếp',
        content: 'Em chưa hiểu rõ về thuật toán Quick Sort. Thầy có thể giải thích thêm không ạ?',
        author: users[4]._id,
        course: courses[1]._id,
        category: 'question',
        comments: [
          {
            author: users[0]._id,
            content: 'Quick Sort là thuật toán chia để trị. Thầy sẽ giải thích chi tiết ở buổi học sau nhé.',
            createdAt: new Date()
          }
        ]
      },
      {
        title: 'Tài liệu tham khảo về kiến trúc hiện đại',
        content: 'Các bạn có thể tham khảo sách "Kiến trúc hiện đại thế giới" của tác giả Nguyễn Văn A',
        author: users[1]._id,
        course: courses[2]._id,
        category: 'resource'
      }
    ]);

    console.log(`✅ Created ${forumPosts.length} forum posts`);

    res.json({
      success: true,
      message: 'Database seeded successfully!',
      data: {
        users: users.length,
        courses: courses.length,
        assignments: assignments.length,
        forumPosts: forumPosts.length
      },
      credentials: {
        teacher1: { email: 'giaovien@dau.edu.vn', password: '123456' },
        teacher2: { email: 'gvbinh@dau.edu.vn', password: '123456' },
        student1: { email: 'student1@dau.edu.vn', password: '123456' },
        student2: { email: 'student2@dau.edu.vn', password: '123456' },
        student3: { email: 'student3@dau.edu.vn', password: '123456' }
      }
    });

  } catch (error) {
    console.error('❌ Seed error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error seeding database', 
      error: error.message 
    });
  }
});

// @route   GET /api/seed/status
// @desc    Check database status
// @access  Public
router.get('/status', async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const courseCount = await Course.countDocuments();
    const assignmentCount = await Assignment.countDocuments();
    const forumPostCount = await ForumPost.countDocuments();
    const moduleCount = await Module.countDocuments();

    res.json({
      success: true,
      data: {
        users: userCount,
        courses: courseCount,
        assignments: assignmentCount,
        forumPosts: forumPostCount,
        modules: moduleCount
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error checking database status', 
      error: error.message 
    });
  }
});

// @route   POST /api/seed/modules
// @desc    Seed modules for existing courses
// @access  Public (demo only)
router.post('/modules', async (req, res) => {
  try {
    console.log('🌱 Seeding modules...');
    
    // Find courses
    const courses = await Course.find().limit(3);
    
    if (courses.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No courses found. Please seed courses first.'
      });
    }
    
    // Clear existing modules
    await Module.deleteMany({});
    
    let totalCreated = 0;
    
    // Create modules for each course
    for (const course of courses) {
      for (const moduleData of sampleModules) {
        await Module.create({
          ...moduleData,
          course: course._id
        });
        totalCreated++;
      }
    }
    
    res.json({
      success: true,
      message: `Successfully created ${totalCreated} modules for ${courses.length} courses`,
      data: {
        modulesCreated: totalCreated,
        coursesUpdated: courses.length
      }
    });
  } catch (error) {
    console.error('❌ Error seeding modules:', error);
    res.status(500).json({
      success: false,
      message: 'Error seeding modules',
      error: error.message
    });
  }
});

// @route   POST /api/seed/reset-password
// @desc    Reset password for a specific user (dev/demo only)
// @access  Public
router.post('/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    
    if (!email || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and newPassword'
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User with email ${email} not found`
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({
      success: true,
      message: `Password reset successfully for ${email}`,
      data: {
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('❌ Error resetting password:', error);
    res.status(500).json({
      success: false,
      message: 'Error resetting password',
      error: error.message
    });
  }
});

// @route   POST /api/seed/test-login
// @desc    Test login credentials (dev/demo only)
// @access  Public
router.post('/test-login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User with email ${email} not found in database`
      });
    }

    // Test password comparison
    const isMatch = await user.comparePassword(password);

    res.json({
      success: true,
      message: 'Test completed',
      data: {
        email: user.email,
        name: user.name,
        role: user.role,
        passwordMatch: isMatch,
        hasPasswordField: !!user.password,
        passwordHashLength: user.password?.length || 0
      }
    });
  } catch (error) {
    console.error('❌ Error testing login:', error);
    res.status(500).json({
      success: false,
      message: 'Error testing login',
      error: error.message
    });
  }
});

// @route   POST /api/seed/make-teacher
// @desc    Update any user to teacher role
// @access  Public
router.post('/make-teacher', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email'
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User with email ${email} not found`
      });
    }

    user.role = 'teacher';
    user.department = 'Khoa Công nghệ Thông tin';
    await user.save();

    res.json({
      success: true,
      message: `User ${email} is now a teacher! You can now manage course content.`,
      data: {
        email: user.email,
        name: user.name,
        role: user.role,
        department: user.department
      }
    });
  } catch (error) {
    console.error('❌ Error making teacher:', error);
    res.status(500).json({
      success: false,
      message: 'Error making teacher',
      error: error.message
    });
  }
});

// @route   POST /api/seed/create-demo-accounts
// @desc    Create fresh demo accounts (admin + student)
// @access  Public
router.post('/create-demo-accounts', async (req, res) => {
  try {
    const accounts = [];

    // Create admin if not exists
    let admin = await User.findOne({ email: 'admin@dau.edu.vn' });
    if (!admin) {
      admin = await User.create({
        name: 'Admin DAU',
        email: 'admin@dau.edu.vn',
        password: '123456',
        role: 'admin',
        department: 'Ban Giám hiệu'
      });
      accounts.push(admin);
    }

    // Create demo student if not exists
    let student = await User.findOne({ email: 'demo@dau.edu.vn' });
    if (!student) {
      student = await User.create({
        name: 'Sinh viên Demo',
        email: 'demo@dau.edu.vn',
        password: '123456',
        role: 'student',
        studentId: 'SV999',
        major: 'Công nghệ Thông tin'
      });
      accounts.push(student);
    }

    res.json({
      success: true,
      message: `Created ${accounts.length} demo accounts!`,
      accounts: [
        {
          role: 'admin',
          email: 'admin@dau.edu.vn',
          password: '123456',
          status: admin ? 'created' : 'already exists'
        },
        {
          role: 'student',
          email: 'demo@dau.edu.vn',
          password: '123456',
          status: student ? 'created' : 'already exists'
        }
      ]
    });
  } catch (error) {
    console.error('❌ Error creating demo accounts:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating demo accounts',
      error: error.message
    });
  }
});

// @route   POST /api/seed/fix-teacher
// @desc    Delete and recreate teacher account with correct password
// @access  Public
router.post('/fix-teacher', async (req, res) => {
  try {
    const email = 'giaovien@dau.edu.vn';
    const password = '123456';

    // Delete existing user
    await User.deleteOne({ email });

    // Create new user with proper password hashing
    const user = await User.create({
      name: 'GV. Nguyễn Văn An',
      email: email,
      password: password, // Will be auto-hashed by pre-save hook
      role: 'teacher',
      department: 'Khoa Công nghệ Thông tin'
    });

    res.json({
      success: true,
      message: 'Teacher account recreated successfully! Try login now.',
      data: {
        email: user.email,
        name: user.name,
        role: user.role,
        credentials: {
          email: email,
          password: password
        }
      }
    });
  } catch (error) {
    console.error('❌ Error fixing teacher account:', error);
    res.status(500).json({
      success: false,
      message: 'Error fixing teacher account',
      error: error.message
    });
  }
});

module.exports = router;
