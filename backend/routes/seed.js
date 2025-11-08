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

    // Create users
    const hashedPassword = await bcrypt.hash('123456', 10);

    const users = await User.create([
      {
        name: 'GV. Nguyễn Văn An',
        email: 'giaovien@dau.edu.vn',
        password: hashedPassword,
        role: 'teacher',
        department: 'Khoa Công nghệ Thông tin'
      },
      {
        name: 'GV. Trần Thị Bình',
        email: 'gvbinh@dau.edu.vn',
        password: hashedPassword,
        role: 'teacher',
        department: 'Khoa Kiến trúc'
      },
      {
        name: 'Phạm Minh Tuấn',
        email: 'student1@dau.edu.vn',
        password: hashedPassword,
        role: 'student',
        studentId: 'SV001',
        major: 'Công nghệ Thông tin'
      },
      {
        name: 'Lê Thị Hương',
        email: 'student2@dau.edu.vn',
        password: hashedPassword,
        role: 'student',
        studentId: 'SV002',
        major: 'Kiến trúc'
      },
      {
        name: 'Võ Đức Anh',
        email: 'student3@dau.edu.vn',
        password: hashedPassword,
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

module.exports = router;
