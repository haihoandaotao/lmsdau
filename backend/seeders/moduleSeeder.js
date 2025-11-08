const Module = require('../models/Module');
const Course = require('../models/Course');

const sampleModules = [
  {
    title: 'Giới thiệu về Lập trình',
    description: 'Các khái niệm cơ bản về lập trình máy tính',
    order: 1,
    learningObjectives: [
      'Hiểu được khái niệm cơ bản về lập trình',
      'Biết cách cài đặt môi trường phát triển',
      'Viết được chương trình đầu tiên'
    ],
    isPublished: true,
    unlockCondition: 'sequential',
    items: [
      {
        type: 'video',
        title: 'Bài 1: Lập trình là gì?',
        description: 'Tìm hiểu về lập trình máy tính và vai trò của lập trình viên',
        content: 'https://www.youtube.com/watch?v=zOjov-2OZ0E',
        duration: 10,
        order: 1
      },
      {
        type: 'video',
        title: 'Bài 2: Cài đặt môi trường',
        description: 'Hướng dẫn cài đặt các công cụ cần thiết',
        content: 'https://www.youtube.com/watch?v=SWYqp7iY_Tc',
        duration: 15,
        order: 2
      },
      {
        type: 'reading',
        title: 'Đọc thêm: Lịch sử lập trình',
        description: 'Tài liệu về lịch sử phát triển của lập trình máy tính',
        content: `# Lịch sử Lập trình Máy tính

## Thời kỳ đầu (1940s-1950s)
- Máy tính thế hệ đầu tiên: ENIAC (1945)
- Ngôn ngữ máy và Assembly
- Grace Hopper và compiler đầu tiên

## Thời kỳ phát triển (1960s-1970s)
- FORTRAN (1957) - ngôn ngữ bậc cao đầu tiên
- COBOL, BASIC, Pascal
- Lập trình hướng cấu trúc

## Thời kỳ hiện đại (1980s-nay)
- C, C++, Java
- Lập trình hướng đối tượng
- Python, JavaScript, và các ngôn ngữ hiện đại
- Cloud computing và AI

## Tương lai
- Machine Learning
- Quantum Computing
- Low-code/No-code platforms`,
        order: 3
      }
    ]
  },
  {
    title: 'Biến và Kiểu dữ liệu',
    description: 'Học về biến, kiểu dữ liệu và toán tử',
    order: 2,
    learningObjectives: [
      'Khai báo và sử dụng biến',
      'Phân biệt các kiểu dữ liệu cơ bản',
      'Sử dụng các toán tử'
    ],
    isPublished: true,
    unlockCondition: 'sequential',
    items: [
      {
        type: 'video',
        title: 'Bài 3: Biến trong lập trình',
        description: 'Khái niệm về biến và cách khai báo biến',
        content: 'https://www.youtube.com/watch?v=7lGGxNT7J4w',
        duration: 12,
        order: 1
      },
      {
        type: 'video',
        title: 'Bài 4: Kiểu dữ liệu',
        description: 'Các kiểu dữ liệu cơ bản: số, chuỗi, boolean',
        content: 'https://www.youtube.com/watch?v=EUrUfqj6T7g',
        duration: 14,
        order: 2
      },
      {
        type: 'quiz',
        title: 'Kiểm tra: Biến và Kiểu dữ liệu',
        description: 'Bài kiểm tra kiến thức về biến và kiểu dữ liệu',
        content: null, // Will link to assignment later
        order: 3
      }
    ]
  },
  {
    title: 'Cấu trúc điều khiển',
    description: 'If-else, vòng lặp và cấu trúc điều khiển',
    order: 3,
    learningObjectives: [
      'Sử dụng câu lệnh if-else',
      'Hiểu và sử dụng vòng lặp',
      'Áp dụng cấu trúc điều khiển vào bài toán'
    ],
    isPublished: true,
    unlockCondition: 'sequential',
    items: [
      {
        type: 'video',
        title: 'Bài 5: Câu lệnh if-else',
        description: 'Cấu trúc rẽ nhánh trong lập trình',
        content: 'https://www.youtube.com/watch?v=IsG4Xd6LlsM',
        duration: 16,
        order: 1
      },
      {
        type: 'video',
        title: 'Bài 6: Vòng lặp for',
        description: 'Vòng lặp for và ứng dụng',
        content: 'https://www.youtube.com/watch?v=wxds6MAtUQ0',
        duration: 18,
        order: 2
      },
      {
        type: 'video',
        title: 'Bài 7: Vòng lặp while',
        description: 'Vòng lặp while và do-while',
        content: 'https://www.youtube.com/watch?v=5ww2JcFdsDM',
        duration: 15,
        order: 3
      },
      {
        type: 'assignment',
        title: 'Bài tập: Giải thuật cơ bản',
        description: 'Bài tập lập trình sử dụng vòng lặp',
        content: null,
        order: 4
      }
    ]
  }
];

async function seedModules() {
  try {
    console.log('🌱 Starting module seeding...');
    
    // Find a course to attach modules to
    const courses = await Course.find().limit(3);
    
    if (courses.length === 0) {
      console.log('❌ No courses found. Please seed courses first.');
      return;
    }
    
    // Delete existing modules
    await Module.deleteMany({});
    console.log('🗑️  Cleared existing modules');
    
    // Create modules for each course
    let totalCreated = 0;
    
    for (const course of courses) {
      console.log(`\n📚 Creating modules for: ${course.title}`);
      
      for (const moduleData of sampleModules) {
        const module = await Module.create({
          ...moduleData,
          course: course._id
        });
        
        console.log(`  ✅ Created module: ${module.title} (${module.items.length} items)`);
        totalCreated++;
      }
    }
    
    console.log(`\n✅ Successfully created ${totalCreated} modules`);
    
    // Display summary
    const stats = await Module.aggregate([
      {
        $group: {
          _id: '$course',
          moduleCount: { $sum: 1 },
          totalItems: { $sum: { $size: '$items' } }
        }
      }
    ]);
    
    console.log('\n📊 Module Statistics:');
    for (const stat of stats) {
      const course = await Course.findById(stat._id);
      console.log(`  - ${course.code}: ${stat.moduleCount} modules, ${stat.totalItems} items`);
    }
    
  } catch (error) {
    console.error('❌ Error seeding modules:', error);
  }
}

module.exports = { seedModules, sampleModules };
