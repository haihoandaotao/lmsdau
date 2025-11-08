const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Course = require('./models/Course');
const Assignment = require('./models/Assignment');
const ForumPost = require('./models/ForumPost');
const Progress = require('./models/Progress');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Demo data
const demoUsers = [
  {
    name: 'GV. Nguyễn Văn An',
    email: 'giaovien@dau.edu.vn',
    password: '123456',
    role: 'teacher'
  },
  {
    name: 'GV. Trần Thị Bình',
    email: 'gvbinh@dau.edu.vn',
    password: '123456',
    role: 'teacher'
  },
  {
    name: 'Phạm Minh Tuấn',
    email: 'student1@dau.edu.vn',
    password: '123456',
    role: 'student'
  },
  {
    name: 'Lê Thị Hương',
    email: 'student2@dau.edu.vn',
    password: '123456',
    role: 'student'
  },
  {
    name: 'Võ Đức Anh',
    email: 'student3@dau.edu.vn',
    password: '123456',
    role: 'student'
  }
];

const demoCourses = [
  {
    title: 'Lập trình Web căn bản',
    description: 'Khóa học giới thiệu về HTML, CSS, JavaScript và các công nghệ web hiện đại. Sinh viên sẽ học cách xây dựng website từ cơ bản đến nâng cao.',
    category: 'Công nghệ thông tin',
    credits: 3,
    semester: 'HK1 2024-2025'
  },
  {
    title: 'Cấu trúc dữ liệu và Giải thuật',
    description: 'Khóa học về các cấu trúc dữ liệu cơ bản (Array, Linked List, Stack, Queue, Tree, Graph) và các thuật toán sắp xếp, tìm kiếm.',
    category: 'Công nghệ thông tin',
    credits: 4,
    semester: 'HK1 2024-2025'
  },
  {
    title: 'Thiết kế Kiến trúc',
    description: 'Nguyên lý thiết kế kiến trúc, phân tích không gian, ánh sáng và vật liệu. Thực hành thiết kế các công trình dân dụng và công cộng.',
    category: 'Kiến trúc',
    credits: 4,
    semester: 'HK1 2024-2025'
  },
  {
    title: 'Quản trị Dự án Xây dựng',
    description: 'Các phương pháp quản lý dự án xây dựng, lập kế hoạch, kiểm soát tiến độ, chi phí và chất lượng công trình.',
    category: 'Xây dựng',
    credits: 3,
    semester: 'HK1 2024-2025'
  },
  {
    title: 'Tiếng Anh Chuyên ngành',
    description: 'Phát triển kỹ năng tiếng Anh trong lĩnh vực kiến trúc và xây dựng. Đọc hiểu tài liệu chuyên ngành, viết báo cáo kỹ thuật.',
    category: 'Ngoại ngữ',
    credits: 2,
    semester: 'HK1 2024-2025'
  }
];

const demoAssignments = [
  {
    title: 'Bài tập 1: Tạo Landing Page',
    description: 'Thiết kế và code một landing page cho một sản phẩm bất kỳ. Yêu cầu: responsive, sử dụng HTML5, CSS3, có animation.',
    dueDate: new Date('2025-11-20'),
    maxScore: 100
  },
  {
    title: 'Bài tập 2: JavaScript DOM',
    description: 'Xây dựng ứng dụng Todo List sử dụng JavaScript thuần. Có chức năng thêm, xóa, sửa, đánh dấu hoàn thành.',
    dueDate: new Date('2025-11-25'),
    maxScore: 100
  },
  {
    title: 'Bài tập 3: Responsive Design',
    description: 'Chuyển đổi một website có sẵn thành responsive. Phải hiển thị tốt trên desktop, tablet và mobile.',
    dueDate: new Date('2025-11-30'),
    maxScore: 100
  }
];

const demoForumPosts = [
  {
    title: 'Hỏi về cách optimize performance website',
    content: 'Mọi người có kinh nghiệm gì về việc tối ưu tốc độ tải trang web không? Em đang gặp vấn đề với trang web load chậm.',
    category: 'Thảo luận'
  },
  {
    title: 'Share tài liệu học JavaScript',
    content: 'Em có một số tài liệu hay về JavaScript, chia sẻ cho mọi người cùng học nhé!',
    category: 'Tài liệu'
  },
  {
    title: 'Lỗi khi cài đặt Node.js',
    content: 'Em cài Node.js bị lỗi "Permission denied". Có bạn nào biết cách fix không ạ?',
    category: 'Hỏi đáp'
  }
];

// Seed function
async function seedDatabase() {
  try {
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Course.deleteMany({});
    await Assignment.deleteMany({});
    await ForumPost.deleteMany({});
    await Progress.deleteMany({});
    console.log('✅ Data cleared');

    // Create users
    console.log('\n👥 Creating users...');
    const createdUsers = [];
    for (const userData of demoUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await User.create({
        ...userData,
        password: hashedPassword
      });
      createdUsers.push(user);
      console.log(`✅ Created user: ${user.name} (${user.email})`);
    }

    const teachers = createdUsers.filter(u => u.role === 'teacher');
    const students = createdUsers.filter(u => u.role === 'student');

    // Create courses
    console.log('\n📚 Creating courses...');
    const createdCourses = [];
    for (let i = 0; i < demoCourses.length; i++) {
      const courseData = demoCourses[i];
      const teacher = teachers[i % teachers.length];
      
      const course = await Course.create({
        ...courseData,
        instructor: teacher._id,
        students: i < 3 ? students.map(s => s._id) : []
      });
      createdCourses.push(course);
      console.log(`✅ Created course: ${course.title}`);
    }

    // Create assignments for first course
    console.log('\n📝 Creating assignments...');
    const course1 = createdCourses[0];
    for (const assignmentData of demoAssignments) {
      const assignment = await Assignment.create({
        ...assignmentData,
        course: course1._id,
        instructor: teachers[0]._id
      });
      console.log(`✅ Created assignment: ${assignment.title}`);
    }

    // Create forum posts
    console.log('\n💬 Creating forum posts...');
    const course1Id = createdCourses[0]._id;
    for (let i = 0; i < demoForumPosts.length; i++) {
      const postData = demoForumPosts[i];
      const author = students[i % students.length];
      
      const post = await ForumPost.create({
        ...postData,
        author: author._id,
        course: course1Id
      });
      console.log(`✅ Created forum post: ${post.title}`);
    }

    // Create progress for students
    console.log('\n📊 Creating progress records...');
    for (const student of students) {
      for (const course of createdCourses.slice(0, 3)) {
        await Progress.create({
          student: student._id,
          course: course._id,
          completedLessons: Math.floor(Math.random() * 5),
          grades: [
            {
              assignment: 'Midterm',
              score: Math.floor(Math.random() * 30) + 70,
              maxScore: 100
            }
          ]
        });
      }
    }
    console.log('✅ Progress records created');

    console.log('\n' + '='.repeat(50));
    console.log('🎉 SEED DATA COMPLETED SUCCESSFULLY!');
    console.log('='.repeat(50));
    console.log('\n📋 DEMO ACCOUNTS:');
    console.log('\n👨‍🏫 Teachers:');
    teachers.forEach(t => {
      console.log(`   Email: ${t.email} | Password: 123456`);
    });
    console.log('\n👨‍🎓 Students:');
    students.forEach(s => {
      console.log(`   Email: ${s.email} | Password: 123456`);
    });
    console.log('\n📚 Courses created: ' + createdCourses.length);
    console.log('📝 Assignments created: ' + demoAssignments.length);
    console.log('💬 Forum posts created: ' + demoForumPosts.length);
    console.log('\n✅ You can now login and test the system!');
    console.log('='.repeat(50));

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 Database connection closed');
    process.exit(0);
  }
}

// Run seed
seedDatabase();
