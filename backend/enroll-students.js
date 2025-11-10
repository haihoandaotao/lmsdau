const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Course = require('./models/Course');

async function enrollStudents() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Find course
    const course = await Course.findOne({ code: 'WEBDEV301' });
    if (!course) {
      console.log('❌ Course WEBDEV301 not found');
      process.exit(1);
    }

    console.log(`📚 Found course: ${course.title} (${course.code})`);

    // Find students
    const students = await User.find({ 
      email: { $in: ['student1@dau.edu.vn', 'student2@dau.edu.vn', 'sinhvien@gmail.com'] },
      role: 'student'
    });

    console.log(`👥 Found ${students.length} students\n`);

    // Enroll students
    let successCount = 0;
    for (const student of students) {
      try {
        // Check if already enrolled
        const alreadyEnrolled = student.enrolledCourses.some(c => 
          c.toString() === course._id.toString()
        );

        if (!alreadyEnrolled) {
          student.enrolledCourses.push(course._id);
          await student.save({ validateBeforeSave: false });
          console.log(`✅ Enrolled: ${student.name} (${student.email})`);
          successCount++;
        } else {
          console.log(`⏭️  Already enrolled: ${student.name} (${student.email})`);
        }
      } catch (err) {
        console.log(`❌ Error enrolling ${student.email}:`, err.message);
      }
    }

    console.log('\n🎉 Enrollment completed!');
    console.log(`📊 ${successCount} new enrollments`);
    console.log(`📊 ${students.length - successCount} already enrolled`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

enrollStudents();
