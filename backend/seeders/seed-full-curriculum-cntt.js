const mongoose = require('mongoose');
const Course = require('../models/Course');
const Major = require('../models/Major');
const Curriculum = require('../models/Curriculum');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const fullCurriculumData = {
  // NĂM 1 - HỌC KỲ 1 (16 TC)
  year1_semester1: [
    { code: 'ML101', title: 'Triết học Mác - Lênin', credits: 3, category: 'Đại cương', courseType: 'Bắt buộc' },
    { code: 'NN111', title: 'Tiếng Anh 1', credits: 3, category: 'Đại cương', courseType: 'Bắt buộc' },
    { code: 'TH101', title: 'Toán cao cấp A1', credits: 3, category: 'Cơ sở ngành', courseType: 'Bắt buộc' },
    { code: 'TH102', title: 'Vật lý đại cương', credits: 3, category: 'Cơ sở ngành', courseType: 'Bắt buộc' },
    { code: 'TC101', title: 'Giáo dục thể chất 1', credits: 1, category: 'Đại cương', courseType: 'Bắt buộc' },
    { code: 'CN101', title: 'Nhập môn Công nghệ thông tin', credits: 3, category: 'Cơ sở ngành', courseType: 'Bắt buộc' }
  ],
  
  // NĂM 1 - HỌC KỲ 2 (19 TC)
  year1_semester2: [
    { code: 'ML102', title: 'Kinh tế chính trị Mác - Lênin', credits: 2, category: 'Đại cương', courseType: 'Bắt buộc' },
    { code: 'NN112', title: 'Tiếng Anh 2', credits: 3, category: 'Đại cương', courseType: 'Bắt buộc' },
    { code: 'TH103', title: 'Toán cao cấp A2', credits: 3, category: 'Cơ sở ngành', courseType: 'Bắt buộc' },
    { code: 'TH104', title: 'Xác suất thống kê', credits: 3, category: 'Cơ sở ngành', courseType: 'Bắt buộc' },
    { code: 'TC102', title: 'Giáo dục thể chất 2', credits: 1, category: 'Đại cương', courseType: 'Bắt buộc' },
    { code: 'CN102', title: 'Lập trình căn bản C/C++', credits: 4, category: 'Cơ sở ngành', courseType: 'Bắt buộc' },
    { code: 'CN103', title: 'Kiến trúc máy tính', credits: 3, category: 'Cơ sở ngành', courseType: 'Bắt buộc' }
  ],

  // NĂM 1 - HÈ (3 TC)
  year1_summer: [
    { code: 'TC103', title: 'Giáo dục quốc phòng', credits: 3, category: 'Đại cương', courseType: 'Bắt buộc' }
  ],

  // NĂM 2 - HỌC KỲ 1 (19 TC)
  year2_semester1: [
    { code: 'ML103', title: 'Chủ nghĩa xã hội khoa học', credits: 2, category: 'Đại cương', courseType: 'Bắt buộc' },
    { code: 'NN121', title: 'Tiếng Anh 3', credits: 3, category: 'Đại cương', courseType: 'Bắt buộc' },
    { code: 'TH201', title: 'Toán rời rạc', credits: 3, category: 'Cơ sở ngành', courseType: 'Bắt buộc' },
    { code: 'CN201', title: 'Cấu trúc dữ liệu và giải thuật', credits: 4, category: 'Cơ sở ngành', courseType: 'Bắt buộc' },
    { code: 'CN202', title: 'Lập trình hướng đối tượng (Java)', credits: 4, category: 'Cơ sở ngành', courseType: 'Bắt buộc' },
    { code: 'CN203', title: 'Hệ điều hành', credits: 3, category: 'Cơ sở ngành', courseType: 'Bắt buộc' }
  ],

  // NĂM 2 - HỌC KỲ 2 (19 TC)
  year2_semester2: [
    { code: 'ML104', title: 'Tư tưởng Hồ Chí Minh', credits: 2, category: 'Đại cương', courseType: 'Bắt buộc' },
    { code: 'NN122', title: 'Tiếng Anh 4', credits: 3, category: 'Đại cương', courseType: 'Bắt buộc' },
    { code: 'CN204', title: 'Cơ sở dữ liệu', credits: 4, category: 'Cơ sở ngành', courseType: 'Bắt buộc' },
    { code: 'CN205', title: 'Mạng máy tính', credits: 3, category: 'Cơ sở ngành', courseType: 'Bắt buộc' },
    { code: 'CN206', title: 'Phân tích thiết kế hệ thống', credits: 4, category: 'Cơ sở ngành', courseType: 'Bắt buộc' },
    { code: 'CN207', title: 'Công nghệ Web', credits: 3, category: 'Chuyên ngành', courseType: 'Bắt buộc' }
  ],

  // NĂM 2 - HÈ (3 TC)
  year2_summer: [
    { code: 'CN208', title: 'Thực tập cơ sở', credits: 3, category: 'Cơ sở ngành', courseType: 'Bắt buộc' }
  ],

  // NĂM 3 - HỌC KỲ 1 (18 TC)
  year3_semester1: [
    { code: 'ML105', title: 'Lịch sử Đảng Cộng sản Việt Nam', credits: 2, category: 'Đại cương', courseType: 'Bắt buộc' },
    { code: 'CN301', title: 'Lập trình Web nâng cao', credits: 4, category: 'Chuyên ngành', courseType: 'Bắt buộc' },
    { code: 'CN302', title: 'Lập trình Mobile (Android/iOS)', credits: 4, category: 'Chuyên ngành', courseType: 'Bắt buộc' },
    { code: 'CN303', title: 'Kỹ thuật phần mềm', credits: 3, category: 'Chuyên ngành', courseType: 'Bắt buộc' },
    { code: 'CN304', title: 'An ninh mạng', credits: 3, category: 'Chuyên ngành', courseType: 'Bắt buộc' },
    { code: 'CN305', title: 'Trí tuệ nhân tạo', credits: 3, category: 'Chuyên ngành', courseType: 'Tự chọn' }
  ],

  // NĂM 3 - HỌC KỲ 2 (18 TC)
  year3_semester2: [
    { code: 'PL101', title: 'Pháp luật đại cương', credits: 2, category: 'Đại cương', courseType: 'Bắt buộc' },
    { code: 'CN306', title: 'Học máy (Machine Learning)', credits: 4, category: 'Chuyên ngành', courseType: 'Bắt buộc' },
    { code: 'CN307', title: 'Xử lý ảnh số', credits: 3, category: 'Chuyên ngành', courseType: 'Tự chọn' },
    { code: 'CN308', title: 'Cloud Computing', credits: 3, category: 'Chuyên ngành', courseType: 'Bắt buộc' },
    { code: 'CN309', title: 'Kiểm thử phần mềm', credits: 3, category: 'Chuyên ngành', courseType: 'Bắt buộc' },
    { code: 'CN310', title: 'Phát triển ứng dụng doanh nghiệp', credits: 3, category: 'Chuyên ngành', courseType: 'Tự chọn' }
  ],

  // NĂM 3 - HÈ (4 TC)
  year3_summer: [
    { code: 'CN311', title: 'Thực tập chuyên ngành', credits: 4, category: 'Chuyên ngành', courseType: 'Bắt buộc' }
  ],

  // NĂM 4 - HỌC KỲ 1 (15 TC)
  year4_semester1: [
    { code: 'CN401', title: 'Blockchain và ứng dụng', credits: 3, category: 'Chuyên ngành', courseType: 'Tự chọn' },
    { code: 'CN402', title: 'Internet of Things (IoT)', credits: 3, category: 'Chuyên ngành', courseType: 'Tự chọn' },
    { code: 'CN403', title: 'Big Data', credits: 3, category: 'Chuyên ngành', courseType: 'Tự chọn' },
    { code: 'CN404', title: 'DevOps và CI/CD', credits: 3, category: 'Chuyên ngành', courseType: 'Tự chọn' },
    { code: 'CN405', title: 'Khởi nghiệp công nghệ', credits: 3, category: 'Đại cương', courseType: 'Tự chọn' }
  ],

  // NĂM 4 - HỌC KỲ 2 (18 TC)
  year4_semester2: [
    { code: 'CN406', title: 'Thị giác máy tính', credits: 3, category: 'Chuyên ngành', courseType: 'Tự chọn' },
    { code: 'CN407', title: 'Xử lý ngôn ngữ tự nhiên', credits: 3, category: 'Chuyên ngành', courseType: 'Tự chọn' },
    { code: 'CN408', title: 'Game Development', credits: 3, category: 'Chuyên ngành', courseType: 'Tự chọn' },
    { code: 'CN409', title: 'Quản trị dự án CNTT', credits: 3, category: 'Chuyên ngành', courseType: 'Bắt buộc' },
    { code: 'CN410', title: 'Đồ án tốt nghiệp', credits: 6, category: 'Khóa luận', courseType: 'Bắt buộc' }
  ]
};

const seedFullCurriculum = async () => {
  try {
    await connectDB();

    console.log('\n🗑️  Clearing existing courses...');
    await Course.deleteMany({});

    // Get CNTT major
    const cnttMajor = await Major.findOne({ code: 'CNTT' });
    if (!cnttMajor) {
      console.error('❌ CNTT major not found. Please run seed-majors-curriculum.js first');
      process.exit(1);
    }

    console.log(`\n📚 Creating courses for ${cnttMajor.name}...`);

    // Create all courses
    const allCourses = [];
    const coursesByYear = [];

    // Year 1
    console.log('\n📖 Year 1...');
    const year1sem1Courses = await Course.insertMany(
      fullCurriculumData.year1_semester1.map(c => ({
        ...c,
        major: cnttMajor._id,
        academicYear: 1,
        semester: 1,
        year: 2024,
        description: `Môn học ${c.title} - ${c.category}`,
        instructor: null,
        status: 'published'
      }))
    );
    console.log(`  ✅ Semester 1: ${year1sem1Courses.length} courses`);

    const year1sem2Courses = await Course.insertMany(
      fullCurriculumData.year1_semester2.map(c => ({
        ...c,
        major: cnttMajor._id,
        academicYear: 1,
        semester: 2,
        year: 2024,
        description: `Môn học ${c.title} - ${c.category}`,
        instructor: null,
        status: 'published'
      }))
    );
    console.log(`  ✅ Semester 2: ${year1sem2Courses.length} courses`);

    const year1summerCourses = await Course.insertMany(
      fullCurriculumData.year1_summer.map(c => ({
        ...c,
        major: cnttMajor._id,
        academicYear: 1,
        semester: 'Summer',
        year: 2024,
        description: `Môn học ${c.title} - ${c.category}`,
        instructor: null,
        status: 'published'
      }))
    );
    console.log(`  ✅ Summer: ${year1summerCourses.length} courses`);

    coursesByYear.push({
      year: 1,
      courses: [
        ...year1sem1Courses.map(c => ({ course: c._id, semester: 1, isRequired: c.courseType === 'Bắt buộc' })),
        ...year1sem2Courses.map(c => ({ course: c._id, semester: 2, isRequired: c.courseType === 'Bắt buộc' })),
        ...year1summerCourses.map(c => ({ course: c._id, semester: 'Summer', isRequired: c.courseType === 'Bắt buộc' }))
      ]
    });

    // Year 2
    console.log('\n📖 Year 2...');
    const year2sem1Courses = await Course.insertMany(
      fullCurriculumData.year2_semester1.map(c => ({
        ...c,
        major: cnttMajor._id,
        academicYear: 2,
        semester: 1,
        year: 2024,
        description: `Môn học ${c.title} - ${c.category}`,
        instructor: null,
        status: 'published'
      }))
    );
    console.log(`  ✅ Semester 1: ${year2sem1Courses.length} courses`);

    const year2sem2Courses = await Course.insertMany(
      fullCurriculumData.year2_semester2.map(c => ({
        ...c,
        major: cnttMajor._id,
        academicYear: 2,
        semester: 2,
        year: 2024,
        description: `Môn học ${c.title} - ${c.category}`,
        instructor: null,
        status: 'published'
      }))
    );
    console.log(`  ✅ Semester 2: ${year2sem2Courses.length} courses`);

    const year2summerCourses = await Course.insertMany(
      fullCurriculumData.year2_summer.map(c => ({
        ...c,
        major: cnttMajor._id,
        academicYear: 2,
        semester: 'Summer',
        year: 2024,
        description: `Môn học ${c.title} - ${c.category}`,
        instructor: null,
        status: 'published'
      }))
    );
    console.log(`  ✅ Summer: ${year2summerCourses.length} courses`);

    coursesByYear.push({
      year: 2,
      courses: [
        ...year2sem1Courses.map(c => ({ course: c._id, semester: 1, isRequired: c.courseType === 'Bắt buộc' })),
        ...year2sem2Courses.map(c => ({ course: c._id, semester: 2, isRequired: c.courseType === 'Bắt buộc' })),
        ...year2summerCourses.map(c => ({ course: c._id, semester: 'Summer', isRequired: c.courseType === 'Bắt buộc' }))
      ]
    });

    // Year 3
    console.log('\n📖 Year 3...');
    const year3sem1Courses = await Course.insertMany(
      fullCurriculumData.year3_semester1.map(c => ({
        ...c,
        major: cnttMajor._id,
        academicYear: 3,
        semester: 1,
        year: 2024,
        description: `Môn học ${c.title} - ${c.category}`,
        instructor: null,
        status: 'published'
      }))
    );
    console.log(`  ✅ Semester 1: ${year3sem1Courses.length} courses`);

    const year3sem2Courses = await Course.insertMany(
      fullCurriculumData.year3_semester2.map(c => ({
        ...c,
        major: cnttMajor._id,
        academicYear: 3,
        semester: 2,
        year: 2024,
        description: `Môn học ${c.title} - ${c.category}`,
        instructor: null,
        status: 'published'
      }))
    );
    console.log(`  ✅ Semester 2: ${year3sem2Courses.length} courses`);

    const year3summerCourses = await Course.insertMany(
      fullCurriculumData.year3_summer.map(c => ({
        ...c,
        major: cnttMajor._id,
        academicYear: 3,
        semester: 'Summer',
        year: 2024,
        description: `Môn học ${c.title} - ${c.category}`,
        instructor: null,
        status: 'published'
      }))
    );
    console.log(`  ✅ Summer: ${year3summerCourses.length} courses`);

    coursesByYear.push({
      year: 3,
      courses: [
        ...year3sem1Courses.map(c => ({ course: c._id, semester: 1, isRequired: c.courseType === 'Bắt buộc' })),
        ...year3sem2Courses.map(c => ({ course: c._id, semester: 2, isRequired: c.courseType === 'Bắt buộc' })),
        ...year3summerCourses.map(c => ({ course: c._id, semester: 'Summer', isRequired: c.courseType === 'Bắt buộc' }))
      ]
    });

    // Year 4
    console.log('\n📖 Year 4...');
    const year4sem1Courses = await Course.insertMany(
      fullCurriculumData.year4_semester1.map(c => ({
        ...c,
        major: cnttMajor._id,
        academicYear: 4,
        semester: 1,
        year: 2024,
        description: `Môn học ${c.title} - ${c.category}`,
        instructor: null,
        status: 'published'
      }))
    );
    console.log(`  ✅ Semester 1: ${year4sem1Courses.length} courses`);

    const year4sem2Courses = await Course.insertMany(
      fullCurriculumData.year4_semester2.map(c => ({
        ...c,
        major: cnttMajor._id,
        academicYear: 4,
        semester: 2,
        year: 2024,
        description: `Môn học ${c.title} - ${c.category}`,
        instructor: null,
        status: 'published'
      }))
    );
    console.log(`  ✅ Semester 2: ${year4sem2Courses.length} courses`);

    coursesByYear.push({
      year: 4,
      courses: [
        ...year4sem1Courses.map(c => ({ course: c._id, semester: 1, isRequired: c.courseType === 'Bắt buộc' })),
        ...year4sem2Courses.map(c => ({ course: c._id, semester: 2, isRequired: c.courseType === 'Bắt buộc' }))
      ]
    });

    // Count total courses and credits
    const totalCourses = await Course.countDocuments({ major: cnttMajor._id });
    const allCoursesData = await Course.find({ major: cnttMajor._id });
    const totalCredits = allCoursesData.reduce((sum, c) => sum + c.credits, 0);

    console.log('\n📊 Total Statistics:');
    console.log(`   Total Courses: ${totalCourses}`);
    console.log(`   Total Credits: ${totalCredits}`);

    // Update curriculum
    console.log('\n📋 Updating curriculum structure...');
    const curriculum = await Curriculum.findOne({ major: cnttMajor._id });
    
    if (curriculum) {
      // Build structure: flatten courses by year and semester
      const structureArray = [];
      
      for (const yearData of coursesByYear) {
        // Group courses by semester for this year
        const semesters = {};
        yearData.courses.forEach(c => {
          const semKey = c.semester;
          if (!semesters[semKey]) {
            semesters[semKey] = [];
          }
          semesters[semKey].push({
            course: c.course,
            isRequired: c.isRequired,
            prerequisites: []
          });
        });
        
        // Create structure entries for each semester
        Object.keys(semesters).forEach(sem => {
          let semesterNum = sem === 'Summer' ? 3 : parseInt(sem);
          structureArray.push({
            year: yearData.year,
            semester: semesterNum,
            courses: semesters[sem]
          });
        });
      }
      
      curriculum.structure = structureArray;
      curriculum.totalCredits = totalCredits;
      
      // Update categories
      const daiCuongCourses = allCoursesData.filter(c => c.category === 'Đại cương');
      const coSoNganhCourses = allCoursesData.filter(c => c.category === 'Cơ sở ngành');
      const chuyenNganhCourses = allCoursesData.filter(c => c.category === 'Chuyên ngành');
      const tuChonCourses = allCoursesData.filter(c => c.courseType === 'Tự chọn');
      const khoaLuanCourses = allCoursesData.filter(c => c.category === 'Khóa luận');

      curriculum.categories = {
        generalEducation: {
          credits: daiCuongCourses.reduce((sum, c) => sum + c.credits, 0),
          courses: daiCuongCourses.map(c => c._id)
        },
        foundational: {
          credits: coSoNganhCourses.reduce((sum, c) => sum + c.credits, 0),
          courses: coSoNganhCourses.map(c => c._id)
        },
        specialized: {
          credits: chuyenNganhCourses.reduce((sum, c) => sum + c.credits, 0),
          courses: chuyenNganhCourses.map(c => c._id)
        },
        elective: {
          credits: tuChonCourses.reduce((sum, c) => sum + c.credits, 0),
          courses: tuChonCourses.map(c => c._id)
        },
        thesis: {
          credits: khoaLuanCourses.reduce((sum, c) => sum + c.credits, 0),
          courses: khoaLuanCourses.map(c => c._id)
        }
      };

      await curriculum.save();
      console.log('✅ Curriculum updated successfully');
    }

    // Update major statistics
    cnttMajor.metadata = {
      studentCount: cnttMajor.metadata?.studentCount || 0,
      courseCount: totalCourses,
      lastUpdated: new Date()
    };
    await cnttMajor.save();

    console.log('\n🎉 FULL CURRICULUM SEEDING COMPLETED!\n');
    console.log('📊 Summary:');
    console.log(`   - Major: ${cnttMajor.name} (${cnttMajor.code})`);
    console.log(`   - Total Courses: ${totalCourses}`);
    console.log(`   - Total Credits: ${totalCredits}`);
    console.log(`   - Year 1: ${fullCurriculumData.year1_semester1.length + fullCurriculumData.year1_semester2.length + fullCurriculumData.year1_summer.length} courses`);
    console.log(`   - Year 2: ${fullCurriculumData.year2_semester1.length + fullCurriculumData.year2_semester2.length + fullCurriculumData.year2_summer.length} courses`);
    console.log(`   - Year 3: ${fullCurriculumData.year3_semester1.length + fullCurriculumData.year3_semester2.length + fullCurriculumData.year3_summer.length} courses`);
    console.log(`   - Year 4: ${fullCurriculumData.year4_semester1.length + fullCurriculumData.year4_semester2.length} courses`);
    console.log(`\n   Category Breakdown:`);
    console.log(`   - Đại cương: ${allCoursesData.filter(c => c.category === 'Đại cương').length} courses (${allCoursesData.filter(c => c.category === 'Đại cương').reduce((sum, c) => sum + c.credits, 0)} TC)`);
    console.log(`   - Cơ sở ngành: ${allCoursesData.filter(c => c.category === 'Cơ sở ngành').length} courses (${allCoursesData.filter(c => c.category === 'Cơ sở ngành').reduce((sum, c) => sum + c.credits, 0)} TC)`);
    console.log(`   - Chuyên ngành: ${allCoursesData.filter(c => c.category === 'Chuyên ngành').length} courses (${allCoursesData.filter(c => c.category === 'Chuyên ngành').reduce((sum, c) => sum + c.credits, 0)} TC)`);
    console.log(`   - Khóa luận: ${allCoursesData.filter(c => c.category === 'Khóa luận').length} courses (${allCoursesData.filter(c => c.category === 'Khóa luận').reduce((sum, c) => sum + c.credits, 0)} TC)`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

seedFullCurriculum();
