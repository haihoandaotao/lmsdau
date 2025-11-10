const mongoose = require('mongoose');
require('dotenv').config();

const Major = require('../models/Major');
const Curriculum = require('../models/Curriculum');
const Course = require('../models/Course');
const User = require('../models/User');

async function seedMajorsAndCurriculum() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Clear existing data
    console.log('🗑️  Clearing existing majors and curriculums...');
    await Major.deleteMany({});
    await Curriculum.deleteMany({});

    // 1. Create Majors (Ngành đào tạo)
    console.log('\n📚 Creating Majors...');
    
    const majors = await Major.create([
      {
        code: 'CNTT',
        name: 'Công nghệ Thông tin',
        fullName: 'Ngành Công nghệ Thông tin',
        description: 'Đào tạo cử nhân CNTT với kiến thức nền tảng vững chắc về lập trình, hệ thống thông tin, mạng máy tính và an toàn thông tin',
        faculty: 'Khoa Công nghệ Thông tin',
        trainingLevel: 'Đại học',
        duration: 4,
        totalCredits: 120,
        admissionYear: 2020,
        objectives: [
          'Nắm vững kiến thức nền tảng về khoa học máy tính',
          'Thành thạo ít nhất 2 ngôn ngữ lập trình hiện đại',
          'Có khả năng phát triển ứng dụng web/mobile',
          'Am hiểu về cơ sở dữ liệu và hệ thống thông tin',
          'Kỹ năng làm việc nhóm và quản lý dự án'
        ],
        careerOpportunities: [
          'Lập trình viên (Web, Mobile, Desktop)',
          'Quản trị hệ thống mạng',
          'Chuyên viên phân tích dữ liệu',
          'Kiến trúc sư giải pháp',
          'Quản lý dự án CNTT'
        ],
        isActive: true
      },
      {
        code: 'KTXD',
        name: 'Kiến trúc',
        fullName: 'Ngành Kiến trúc',
        description: 'Đào tạo kiến trúc sư với khả năng thiết kế, lập kế hoạch và quản lý công trình xây dựng',
        faculty: 'Khoa Kiến trúc',
        trainingLevel: 'Đại học',
        duration: 5,
        totalCredits: 150,
        admissionYear: 2020,
        objectives: [
          'Nắm vững nguyên lý thiết kế kiến trúc',
          'Thành thạo các phần mềm thiết kế (AutoCAD, Revit, SketchUp)',
          'Hiểu biết về quy hoạch đô thị',
          'Kỹ năng quản lý và giám sát công trình'
        ],
        careerOpportunities: [
          'Kiến trúc sư thiết kế',
          'Chuyên viên quy hoạch',
          'Giám sát thi công',
          'Tư vấn thiết kế nội thất'
        ],
        isActive: true
      },
      {
        code: 'KTTM',
        name: 'Kế toán',
        fullName: 'Ngành Kế toán',
        description: 'Đào tạo chuyên viên kế toán với kiến thức chuyên sâu về kế toán tài chính, kế toán quản trị và kiểm toán',
        faculty: 'Khoa Kinh tế',
        trainingLevel: 'Đại học',
        duration: 4,
        totalCredits: 120,
        admissionYear: 2020,
        objectives: [
          'Nắm vững chuẩn mực kế toán Việt Nam',
          'Thành thạo phần mềm kế toán (MISA, SAP)',
          'Có khả năng lập và phân tích báo cáo tài chính',
          'Hiểu biết về luật thuế và kiểm toán'
        ],
        careerOpportunities: [
          'Kế toán viên',
          'Kiểm toán viên',
          'Chuyên viên phân tích tài chính',
          'Trưởng phòng kế toán'
        ],
        isActive: true
      }
    ]);

    console.log(`✅ Created ${majors.length} majors`);
    majors.forEach(m => console.log(`   - ${m.code}: ${m.name}`));

    // 2. Update existing courses with major
    console.log('\n📖 Updating existing courses with major...');
    const cnttMajor = majors.find(m => m.code === 'CNTT');
    
    await Course.updateMany(
      { code: { $in: ['WEBDEV301', 'DSA201X', 'DB202X', 'IT101', 'IT201'] } },
      { 
        major: cnttMajor._id,
        academicYear: 1,
        category: 'Chuyên ngành',
        courseType: 'Bắt buộc'
      }
    );
    console.log('✅ Updated existing IT courses');

    // 3. Create Curriculum for CNTT
    console.log('\n📋 Creating Curriculum for CNTT...');
    
    // Get some courses
    const courses = await Course.find({ major: cnttMajor._id }).limit(5);

    const cnttCurriculum = await Curriculum.create({
      code: 'CTDT-CNTT-2024',
      name: 'Chương trình đào tạo Công nghệ Thông tin khóa 2024',
      major: cnttMajor._id,
      effectiveYear: 2024,
      description: 'Chương trình đào tạo cử nhân CNTT theo chuẩn CDIO, tích hợp kiến thức nền tảng và thực hành dự án',
      totalCredits: 120,
      isActive: true,
      structure: [
        {
          year: 1,
          semester: 1,
          courses: courses.slice(0, 2).map(c => ({
            course: c._id,
            isRequired: true,
            prerequisites: []
          }))
        },
        {
          year: 1,
          semester: 2,
          courses: courses.slice(2, 4).map(c => ({
            course: c._id,
            isRequired: true,
            prerequisites: []
          }))
        },
        {
          year: 2,
          semester: 1,
          courses: courses.slice(4, 5).map(c => ({
            course: c._id,
            isRequired: true,
            prerequisites: courses.slice(0, 1).map(c => c._id)
          }))
        }
      ],
      categories: {
        generalEducation: {
          credits: 30,
          courses: []
        },
        foundational: {
          credits: 40,
          courses: courses.slice(0, 2).map(c => c._id)
        },
        specialized: {
          credits: 35,
          courses: courses.slice(2, 5).map(c => c._id)
        },
        elective: {
          credits: 10,
          courses: []
        },
        thesis: {
          credits: 5,
          courses: []
        }
      }
    });

    console.log(`✅ Created curriculum: ${cnttCurriculum.code}`);

    // 4. Update students with major and curriculum
    console.log('\n👥 Updating students with major and curriculum...');
    
    const students = await User.find({ role: 'student' });
    
    for (let i = 0; i < students.length; i++) {
      const student = students[i];
      student.major = cnttMajor._id;
      student.curriculum = cnttCurriculum._id;
      student.admissionYear = 2024;
      student.studentClass = `CNTT0${i + 1}`;
      await student.save({ validateBeforeSave: false });
      console.log(`✅ Updated: ${student.name} - ${student.studentClass}`);
    }

    // 5. Update counts
    console.log('\n📊 Updating statistics...');
    await cnttMajor.updateStudentCount();
    await cnttMajor.updateCourseCount();
    await cnttCurriculum.updateEnrolledCount();

    console.log('\n🎉 SEEDING COMPLETED!');
    console.log('\n📊 Summary:');
    console.log(`   - Majors: ${majors.length}`);
    console.log(`   - Curriculums: 1`);
    console.log(`   - Updated Courses: ${courses.length}`);
    console.log(`   - Updated Students: ${students.length}`);
    console.log(`\n✅ All students now belong to major: ${cnttMajor.name}`);
    console.log(`✅ Curriculum: ${cnttCurriculum.name}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

seedMajorsAndCurriculum();
