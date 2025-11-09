const Module = require('../models/Module');
const Course = require('../models/Course');

// Real programming tutorial videos from YouTube
const realModules = [
  {
    title: 'Module 1: Giới thiệu Python cơ bản',
    description: 'Học Python từ đầu - cú pháp cơ bản, biến, kiểu dữ liệu',
    learningObjectives: [
      'Hiểu cú pháp Python cơ bản',
      'Làm việc với biến và kiểu dữ liệu',
      'Viết chương trình Python đầu tiên'
    ],
    items: [
      {
        type: 'video',
        title: 'Python trong 100 giây',
        description: 'Tổng quan nhanh về Python',
        videoUrl: 'https://www.youtube.com/watch?v=x7X9w_GIm1s',
        videoProvider: 'youtube',
        videoDuration: 142,
        thumbnail: 'https://i.ytimg.com/vi/x7X9w_GIm1s/maxresdefault.jpg',
        unlockCondition: 'none',
        isRequired: true
      },
      {
        type: 'video',
        title: 'Python Tutorial for Beginners',
        description: 'Hướng dẫn Python cho người mới bắt đầu',
        videoUrl: 'https://www.youtube.com/watch?v=kqtD5dpn9C8',
        videoProvider: 'youtube',
        videoDuration: 3810,
        thumbnail: 'https://i.ytimg.com/vi/kqtD5dpn9C8/maxresdefault.jpg',
        unlockCondition: 'sequential',
        isRequired: true
      },
      {
        type: 'reading',
        title: 'Tài liệu: Python Basics',
        description: 'Đọc thêm về cú pháp Python',
        content: `# Python Programming Basics

## 1. Variables (Biến)
\`\`\`python
name = "John"
age = 25
price = 99.99
is_student = True
\`\`\`

## 2. Data Types (Kiểu dữ liệu)
- **int**: Số nguyên
- **float**: Số thực
- **str**: Chuỗi
- **bool**: Boolean

## 3. Operators (Toán tử)
\`\`\`python
# Arithmetic
result = 10 + 5  # 15
result = 10 - 5  # 5
result = 10 * 5  # 50
result = 10 / 5  # 2.0

# Comparison
10 == 10  # True
10 != 5   # True
10 > 5    # True
\`\`\`

## 4. Input/Output
\`\`\`python
name = input("Enter your name: ")
print(f"Hello, {name}!")
\`\`\``,
        readingTime: 10,
        unlockCondition: 'none',
        isRequired: false
      }
    ]
  },
  {
    title: 'Module 2: Cấu trúc điều khiển',
    description: 'If-else, vòng lặp for, while',
    learningObjectives: [
      'Sử dụng if-else để điều khiển luồng',
      'Làm việc với vòng lặp for và while',
      'Xử lý break, continue'
    ],
    items: [
      {
        type: 'video',
        title: 'Python If Else Statements',
        description: 'Câu lệnh điều kiện trong Python',
        videoUrl: 'https://www.youtube.com/watch?v=f4KOjWS_KZs',
        videoProvider: 'youtube',
        videoDuration: 628,
        thumbnail: 'https://i.ytimg.com/vi/f4KOjWS_KZs/maxresdefault.jpg',
        unlockCondition: 'none',
        isRequired: true
      },
      {
        type: 'video',
        title: 'Python Loops - For and While',
        description: 'Vòng lặp trong Python',
        videoUrl: 'https://www.youtube.com/watch?v=94UHCEmprCY',
        videoProvider: 'youtube',
        videoDuration: 741,
        thumbnail: 'https://i.ytimg.com/vi/94UHCEmprCY/maxresdefault.jpg',
        unlockCondition: 'sequential',
        isRequired: true
      }
    ]
  },
  {
    title: 'Module 3: Functions và Modules',
    description: 'Định nghĩa hàm, import modules',
    learningObjectives: [
      'Tạo và gọi functions',
      'Làm việc với parameters và return values',
      'Import và sử dụng modules'
    ],
    items: [
      {
        type: 'video',
        title: 'Python Functions',
        description: 'Hàm trong Python - định nghĩa và sử dụng',
        videoUrl: 'https://www.youtube.com/watch?v=BVfCWuca9nw',
        videoProvider: 'youtube',
        videoDuration: 634,
        thumbnail: 'https://i.ytimg.com/vi/BVfCWuca9nw/maxresdefault.jpg',
        unlockCondition: 'none',
        isRequired: true
      },
      {
        type: 'video',
        title: 'Python Modules and Packages',
        description: 'Làm việc với modules trong Python',
        videoUrl: 'https://www.youtube.com/watch?v=GxCXiSkm6no',
        videoProvider: 'youtube',
        videoDuration: 558,
        thumbnail: 'https://i.ytimg.com/vi/GxCXiSkm6no/maxresdefault.jpg',
        unlockCondition: 'sequential',
        isRequired: true
      }
    ]
  },
  {
    title: 'Module 4: Object-Oriented Programming',
    description: 'Lập trình hướng đối tượng với Python',
    learningObjectives: [
      'Tạo classes và objects',
      'Hiểu về inheritance và polymorphism',
      'Sử dụng encapsulation'
    ],
    items: [
      {
        type: 'video',
        title: 'Python OOP Tutorial',
        description: 'Lập trình hướng đối tượng trong Python',
        videoUrl: 'https://www.youtube.com/watch?v=-pEs-Bss8Wc',
        videoProvider: 'youtube',
        videoDuration: 879,
        thumbnail: 'https://i.ytimg.com/vi/-pEs-Bss8Wc/maxresdefault.jpg',
        unlockCondition: 'none',
        isRequired: true
      },
      {
        type: 'video',
        title: 'Python Classes and Objects',
        description: 'Classes và Objects chi tiết',
        videoUrl: 'https://www.youtube.com/watch?v=apACNr7DC_s',
        videoProvider: 'youtube',
        videoDuration: 901,
        thumbnail: 'https://i.ytimg.com/vi/apACNr7DC_s/maxresdefault.jpg',
        unlockCondition: 'sequential',
        isRequired: true
      }
    ]
  }
];

const seedRealModules = async () => {
  try {
    console.log('🌱 Starting real module seeding...');

    // Get all courses
    const courses = await Course.find({});
    if (courses.length === 0) {
      console.log('❌ No courses found. Please seed courses first.');
      return;
    }

    console.log(`📚 Found ${courses.length} courses`);

    let totalCreated = 0;

    for (const course of courses) {
      console.log(`\n📖 Processing course: ${course.title}`);

      // Delete existing modules for this course
      await Module.deleteMany({ course: course._id });
      console.log(`  🗑️  Deleted old modules`);

      // Create modules for this course
      for (let i = 0; i < realModules.length; i++) {
        const moduleData = realModules[i];
        
        const module = await Module.create({
          ...moduleData,
          course: course._id,
          order: i + 1,
          isPublished: true,
          unlockCondition: i === 0 ? 'none' : 'sequential'
        });

        console.log(`  ✅ Created: ${module.title} (${module.items.length} items)`);
        totalCreated++;
      }
    }

    console.log(`\n✅ Successfully created ${totalCreated} modules for ${courses.length} courses`);
    console.log(`📊 Total items: ${totalCreated * 2} (videos + readings)`);

  } catch (error) {
    console.error('❌ Error seeding real modules:', error);
    throw error;
  }
};

module.exports = { seedRealModules, realModules };
