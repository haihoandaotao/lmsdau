/**
 * Comprehensive LMS Data Seeder
 * Tạo dữ liệu mẫu đầy đủ: Courses, Modules, Videos, PDFs, Quizzes, Assignments, Forum Posts, Users, Submissions
 * Usage: node backend/seeders/comprehensive-seeder.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const User = require('../models/User');
const Course = require('../models/Course');
const Module = require('../models/Module');
const Resource = require('../models/Resource');
const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const ForumPost = require('../models/ForumPost');
const ForumComment = require('../models/ForumComment');

async function seedComprehensiveData() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({ email: { $in: ['teacher1@dau.edu.vn', 'student1@dau.edu.vn', 'student2@dau.edu.vn'] } });
    
    // ========== STEP 1: CREATE USERS ==========
    console.log('\n👥 Creating users...');
    
    const teacher = new User({
      name: 'GV. Nguyễn Văn A',
      email: 'teacher1@dau.edu.vn',
      password: '123456',
      role: 'teacher',
      studentId: 'T001',
      department: 'Khoa Công Nghệ Thông Tin'
    });
    await teacher.save();
    console.log('✅ Created teacher:', teacher.email);

    const student1 = new User({
      name: 'Trần Thị B',
      email: 'student1@dau.edu.vn',
      password: '123456',
      role: 'student',
      studentId: 'SV2024001',
      department: 'Khoa Công Nghệ Thông Tin'
    });
    await student1.save();
    console.log('✅ Created student 1:', student1.email);

    const student2 = new User({
      name: 'Lê Văn C',
      email: 'student2@dau.edu.vn',
      password: '123456',
      role: 'student',
      studentId: 'SV2024002',
      department: 'Khoa Công Nghệ Thông Tin'
    });
    await student2.save();
    console.log('✅ Created student 2:', student2.email);

    // ========== STEP 2: CREATE COURSES ==========
    console.log('\n📚 Creating courses...');

    const courses = [];

    // Course 1: Web Development
    const webDevCourse = new Course({
      title: 'Phát Triển Web Hiện Đại',
      code: 'WEB301',
      description: 'Học cách xây dựng ứng dụng web từ cơ bản đến nâng cao với HTML, CSS, JavaScript, React và Node.js',
      instructor: teacher._id,
      semester: 'Học kỳ 1, 2024-2025',
      credits: 3,
      startDate: new Date('2024-09-01'),
      endDate: new Date('2024-12-31'),
      enrollmentLimit: 50,
      status: 'active',
      category: 'Công Nghệ Web',
      thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
      tags: ['web', 'frontend', 'backend', 'fullstack']
    });
    await webDevCourse.save();
    courses.push(webDevCourse);
    console.log('✅ Created course: Web Development');

    // Course 2: Data Structures & Algorithms
    const dsaCourse = new Course({
      title: 'Cấu Trúc Dữ Liệu và Giải Thuật',
      code: 'DSA201',
      description: 'Nắm vững các cấu trúc dữ liệu cơ bản và giải thuật quan trọng trong lập trình',
      instructor: teacher._id,
      semester: 'Học kỳ 1, 2024-2025',
      credits: 4,
      startDate: new Date('2024-09-01'),
      endDate: new Date('2024-12-31'),
      enrollmentLimit: 40,
      status: 'active',
      category: 'Khoa Học Máy Tính',
      thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800',
      tags: ['algorithm', 'data-structure', 'programming']
    });
    await dsaCourse.save();
    courses.push(dsaCourse);
    console.log('✅ Created course: DSA');

    // Course 3: Database Design
    const dbCourse = new Course({
      title: 'Thiết Kế Cơ Sở Dữ Liệu',
      code: 'DB202',
      description: 'Học cách thiết kế và quản lý cơ sở dữ liệu quan hệ với MySQL và PostgreSQL',
      instructor: teacher._id,
      semester: 'Học kỳ 1, 2024-2025',
      credits: 3,
      startDate: new Date('2024-09-01'),
      endDate: new Date('2024-12-31'),
      enrollmentLimit: 45,
      status: 'active',
      category: 'Cơ Sở Dữ Liệu',
      thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800',
      tags: ['database', 'sql', 'mysql', 'postgresql']
    });
    await dbCourse.save();
    courses.push(dbCourse);
    console.log('✅ Created course: Database Design');

    // Enroll students in courses
    webDevCourse.students.push(student1._id, student2._id);
    await webDevCourse.save();
    
    dsaCourse.students.push(student1._id);
    await dsaCourse.save();
    
    dbCourse.students.push(student2._id);
    await dbCourse.save();

    console.log('✅ Enrolled students in courses');

    // ========== STEP 3: CREATE MODULES WITH ITEMS ==========
    console.log('\n📖 Creating modules and content...');

    // ===== WEB DEVELOPMENT MODULES =====
    const webModule1 = new Module({
      title: 'Week 1: HTML & CSS Fundamentals',
      description: 'Làm quen với HTML và CSS cơ bản',
      course: webDevCourse._id,
      order: 1,
      startDate: new Date('2024-09-01'),
      endDate: new Date('2024-09-07'),
      items: [
        {
          title: 'Giới thiệu HTML5',
          type: 'video',
          videoUrl: 'https://www.youtube.com/watch?v=pQN-pnXPaVg',
          description: 'Tìm hiểu về cấu trúc cơ bản của HTML5',
          duration: 25,
          order: 1
        },
        {
          title: 'Tài liệu: HTML Tags Reference',
          type: 'reading',
          content: String.raw`
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
              <h2 style="color: #2196F3;">📄 HTML Tags Reference</h2>
              <p>Danh sách các thẻ HTML quan trọng:</p>
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr style="background: #e3f2fd;">
                    <th style="border: 1px solid #ddd; padding: 8px;">Thẻ</th>
                    <th style="border: 1px solid #ddd; padding: 8px;">Mô tả</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style="border: 1px solid #ddd; padding: 8px;"><code>&lt;div&gt;</code></td>
                    <td style="border: 1px solid #ddd; padding: 8px;">Container block-level</td>
                  </tr>
                  <tr>
                    <td style="border: 1px solid #ddd; padding: 8px;"><code>&lt;span&gt;</code></td>
                    <td style="border: 1px solid #ddd; padding: 8px;">Container inline</td>
                  </tr>
                  <tr>
                    <td style="border: 1px solid #ddd; padding: 8px;"><code>&lt;h1&gt;-&lt;h6&gt;</code></td>
                    <td style="border: 1px solid #ddd; padding: 8px;">Tiêu đề các cấp</td>
                  </tr>
                </tbody>
              </table>
            </div>
          `,
          description: 'Tham khảo các thẻ HTML thường dùng',
          duration: 10,
          order: 2
        },
        {
          title: 'CSS Styling Basics',
          type: 'video',
          videoUrl: 'https://www.youtube.com/watch?v=1PnVor36_40',
          description: 'Học cách tạo style cho trang web với CSS',
          duration: 30,
          order: 3
        }
      ]
    });
    await webModule1.save();
    console.log('✅ Created Web Module 1');

    // ===== DSA MODULES =====
    const dsaModule1 = new Module({
      title: 'Week 1: Arrays & Linked Lists',
      description: 'Tìm hiểu về mảng và danh sách liên kết',
      course: dsaCourse._id,
      order: 1,
      startDate: new Date('2024-09-01'),
      endDate: new Date('2024-09-07'),
      items: [
        {
          title: 'Introduction to Arrays',
          type: 'video',
          videoUrl: 'https://www.youtube.com/watch?v=7PmS2RPgVeI',
          description: 'Hiểu về cấu trúc dữ liệu mảng',
          duration: 20,
          order: 1
        },
        {
          title: 'Linked Lists Explained',
          type: 'video',
          videoUrl: 'https://www.youtube.com/watch?v=njTh_OwMljA',
          description: 'Danh sách liên kết và ứng dụng',
          duration: 35,
          order: 2
        }
      ]
    });
    await dsaModule1.save();
    console.log('✅ Created DSA Module 1');

    // ===== DATABASE MODULES =====
    const dbModule1 = new Module({
      title: 'Week 1: SQL Fundamentals',
      description: 'Làm quen với SQL cơ bản',
      course: dbCourse._id,
      order: 1,
      startDate: new Date('2024-09-01'),
      endDate: new Date('2024-09-07'),
      items: [
        {
          title: 'SQL SELECT Queries',
          type: 'video',
          videoUrl: 'https://www.youtube.com/watch?v=HXV3zeQKqGY',
          description: 'Truy vấn dữ liệu với SELECT',
          duration: 40,
          order: 1
        },
        {
          title: 'SQL Cheat Sheet',
          type: 'reading',
          content: String.raw`
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px;">
              <h2>🗃️ SQL Commands Cheat Sheet</h2>
              <pre style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 5px; overflow-x: auto;">
SELECT column1, column2 FROM table_name WHERE condition;
INSERT INTO table_name (col1, col2) VALUES (val1, val2);
UPDATE table_name SET col1 = val1 WHERE condition;
DELETE FROM table_name WHERE condition;
              </pre>
            </div>
          `,
          description: 'Các lệnh SQL thường dùng',
          duration: 15,
          order: 2
        }
      ]
    });
    await dbModule1.save();
    console.log('✅ Created DB Module 1');

    // ========== STEP 4: CREATE SAMPLE RESOURCES (PDFs) ==========
    console.log('\n📎 Creating sample resources...');

    const resource1 = new Resource({
      name: 'HTML5 Complete Guide.pdf',
      description: 'Tài liệu hướng dẫn HTML5 đầy đủ',
      type: 'pdf',
      fileUrl: '/uploads/resources/sample-html5-guide.pdf',
      fileName: 'sample-html5-guide.pdf',
      fileSize: 2500000, // 2.5MB
      mimeType: 'application/pdf',
      uploadedBy: teacher._id,
      course: webDevCourse._id,
      module: webModule1._id,
      tags: ['html', 'tutorial', 'guide']
    });
    await resource1.save();

    const resource2 = new Resource({
      name: 'CSS Flexbox Cheat Sheet.pdf',
      description: 'Bảng tra cứu nhanh CSS Flexbox',
      type: 'pdf',
      fileUrl: '/uploads/resources/css-flexbox-cheatsheet.pdf',
      fileName: 'css-flexbox-cheatsheet.pdf',
      fileSize: 1200000, // 1.2MB
      mimeType: 'application/pdf',
      uploadedBy: teacher._id,
      course: webDevCourse._id,
      module: webModule1._id,
      tags: ['css', 'flexbox', 'cheatsheet']
    });
    await resource2.save();

    const resource3 = new Resource({
      name: 'Data Structures Slides.pptx',
      description: 'Bài giảng Cấu trúc dữ liệu',
      type: 'document',
      fileUrl: '/uploads/resources/ds-slides.pptx',
      fileName: 'ds-slides.pptx',
      fileSize: 5000000, // 5MB
      mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      uploadedBy: teacher._id,
      course: dsaCourse._id,
      module: dsaModule1._id,
      tags: ['data-structures', 'slides']
    });
    await resource3.save();

    console.log('✅ Created 3 sample resources');

    // ========== STEP 5: CREATE QUIZZES ==========
    console.log('\n❓ Creating quizzes...');

    const quiz1 = new Quiz({
      title: 'Quiz 1: HTML Basics',
      description: 'Kiểm tra kiến thức HTML cơ bản',
      course: webDevCourse._id,
      module: webModule1._id,
      dueDate: new Date('2024-09-08'),
      timeLimit: 30,
      passingScore: 70,
      questions: [
        {
          questionText: 'HTML là viết tắt của từ gì?',
          questionType: 'multiple-choice',
          points: 10,
          options: [
            { optionText: 'HyperText Markup Language', isCorrect: true },
            { optionText: 'High Tech Modern Language', isCorrect: false },
            { optionText: 'Home Tool Markup Language', isCorrect: false },
            { optionText: 'Hyperlinks and Text Markup Language', isCorrect: false }
          ],
          correctExplanation: 'HTML là HyperText Markup Language - Ngôn ngữ đánh dấu siêu văn bản'
        },
        {
          questionText: 'Thẻ nào dùng để tạo tiêu đề lớn nhất?',
          questionType: 'multiple-choice',
          points: 10,
          options: [
            { optionText: '<h1>', isCorrect: true },
            { optionText: '<h6>', isCorrect: false },
            { optionText: '<heading>', isCorrect: false },
            { optionText: '<title>', isCorrect: false }
          ],
          correctExplanation: '<h1> là thẻ tiêu đề lớn nhất, <h6> là nhỏ nhất'
        },
        {
          questionText: 'Giải thích sự khác biệt giữa <div> và <span>',
          questionType: 'essay',
          points: 20,
          correctExplanation: '<div> là block-level element (chiếm toàn bộ chiều rộng), <span> là inline element (chỉ chiếm đủ không gian cần thiết)'
        }
      ],
      totalPoints: 40,
      shuffleQuestions: true,
      shuffleOptions: true,
      allowReview: true,
      maxAttempts: 3
    });
    await quiz1.save();
    console.log('✅ Created Quiz 1');

    const quiz2 = new Quiz({
      title: 'Quiz 2: Arrays & Complexity',
      description: 'Kiểm tra về mảng và độ phức tạp',
      course: dsaCourse._id,
      module: dsaModule1._id,
      dueDate: new Date('2024-09-08'),
      timeLimit: 45,
      passingScore: 60,
      questions: [
        {
          questionText: 'Độ phức tạp truy cập phần tử mảng theo index là gì?',
          questionType: 'multiple-choice',
          points: 10,
          options: [
            { optionText: 'O(1)', isCorrect: true },
            { optionText: 'O(n)', isCorrect: false },
            { optionText: 'O(log n)', isCorrect: false },
            { optionText: 'O(n^2)', isCorrect: false }
          ],
          correctExplanation: 'Truy cập mảng theo index có độ phức tạp O(1) - constant time'
        }
      ],
      totalPoints: 10,
      shuffleQuestions: false,
      shuffleOptions: true,
      allowReview: true,
      maxAttempts: 2
    });
    await quiz2.save();
    console.log('✅ Created Quiz 2');

    // ========== STEP 6: CREATE QUIZ ATTEMPTS (Students took quizzes) ==========
    console.log('\n📝 Creating quiz attempts...');

    const attempt1 = new QuizAttempt({
      quiz: quiz1._id,
      student: student1._id,
      course: webDevCourse._id,
      startTime: new Date('2024-09-07T10:00:00'),
      endTime: new Date('2024-09-07T10:25:00'),
      answers: [
        {
          question: quiz1.questions[0]._id,
          selectedOptions: [quiz1.questions[0].options[0]._id],
          isCorrect: true,
          pointsAwarded: 10
        },
        {
          question: quiz1.questions[1]._id,
          selectedOptions: [quiz1.questions[1].options[0]._id],
          isCorrect: true,
          pointsAwarded: 10
        },
        {
          question: quiz1.questions[2]._id,
          essayAnswer: 'Div là block element còn span là inline element',
          isCorrect: false,
          pointsAwarded: 15
        }
      ],
      score: 35,
      percentage: 87.5,
      passed: true,
      isSubmitted: true
    });
    await attempt1.save();
    console.log('✅ Student 1 completed Quiz 1: 87.5%');

    // ========== STEP 7: CREATE ASSIGNMENTS ==========
    console.log('\n📋 Creating assignments...');

    const assignment1 = new Assignment({
      title: 'Bài tập 1: Xây dựng Landing Page',
      description: 'Tạo một landing page đơn giản với HTML & CSS',
      course: webDevCourse._id,
      dueDate: new Date('2024-09-15'),
      totalPoints: 100,
      submissionType: 'file',
      instructions: String.raw`
        <h3>Yêu cầu:</h3>
        <ol>
          <li>Sử dụng HTML5 semantic tags</li>
          <li>Responsive design với CSS</li>
          <li>Có header, hero section, features, footer</li>
        </ol>
      `,
      allowLateSubmission: true,
      latePenalty: 10
    });
    await assignment1.save();
    console.log('✅ Created Assignment 1');

    // ========== STEP 8: CREATE SUBMISSIONS ==========
    console.log('\n📤 Creating submissions...');

    const submission1 = new Submission({
      assignment: assignment1._id,
      student: student1._id,
      course: webDevCourse._id,
      content: 'Landing page đã hoàn thành theo yêu cầu',
      files: ['landing-page.html', 'styles.css'],
      submittedAt: new Date('2024-09-14'),
      status: 'graded',
      grade: 95,
      feedback: 'Làm rất tốt! Design đẹp và responsive.'
    });
    await submission1.save();
    console.log('✅ Student 1 submitted Assignment 1: 95/100');

    // ========== STEP 9: CREATE FORUM POSTS ==========
    console.log('\n💬 Creating forum posts...');

    const forumPost1 = new ForumPost({
      title: 'Làm thế nào để center một div?',
      content: 'Mình đang gặp khó khăn trong việc căn giữa một div. Mọi người có thể giúp mình không?',
      author: student1._id,
      course: webDevCourse._id,
      category: 'question',
      tags: ['css', 'flexbox', 'help']
    });
    await forumPost1.save();

    const comment1 = new ForumComment({
      post: forumPost1._id,
      author: teacher._id,
      content: 'Bạn có thể dùng Flexbox: display: flex; justify-content: center; align-items: center;',
      createdAt: new Date()
    });
    await comment1.save();

    forumPost1.comments.push(comment1._id);
    await forumPost1.save();

    console.log('✅ Created forum post with 1 comment');

    console.log('\n' + '='.repeat(60));
    console.log('🎉 COMPREHENSIVE DATA SEEDING COMPLETED!');
    console.log('='.repeat(60));
    console.log('\n📊 Summary:');
    console.log('  👥 Users: 3 (1 teacher, 2 students)');
    console.log('  📚 Courses: 3 (Web Dev, DSA, Database)');
    console.log('  📖 Modules: 3 (with video/reading items)');
    console.log('  📎 Resources: 3 PDFs');
    console.log('  ❓ Quizzes: 2 (with questions)');
    console.log('  📝 Quiz Attempts: 1 (student completed)');
    console.log('  📋 Assignments: 1');
    console.log('  📤 Submissions: 1 (graded)');
    console.log('  💬 Forum Posts: 1 (with comment)');
    console.log('\n🔑 Login Credentials:');
    console.log('  Teacher: teacher1@dau.edu.vn / 123456');
    console.log('  Student 1: student1@dau.edu.vn / 123456');
    console.log('  Student 2: student2@dau.edu.vn / 123456');
    console.log('\n✅ You can now test the full LMS workflow!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Error:', error);
    process.exit(1);
  }
}

seedComprehensiveData();
