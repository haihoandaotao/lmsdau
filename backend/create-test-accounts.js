/**
 * CREATE TEST ACCOUNTS FOR PHASE 1 TESTING
 * Creates teacher and student accounts for manual and automated testing
 */

require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const User = require('./models/User');
const Course = require('./models/Course');
const bcrypt = require('bcryptjs');

async function createTestAccounts() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected\n');

    // 1. Create Teacher Account
    console.log('👨‍🏫 Creating Teacher Account...');
    let teacher = await User.findOne({ email: 'teacher@dau.edu.vn' });
    
    if (teacher) {
      console.log('   ⚠️  Teacher already exists');
    } else {
      const hashedPassword = await bcrypt.hash('teacher123', 10);
      teacher = await User.create({
        email: 'teacher@dau.edu.vn',
        password: hashedPassword,
        name: 'Test Teacher',
        role: 'teacher',
        studentId: 'TEACHER001',
        major: 'Computer Science',
        year: 1
      });
      console.log('   ✅ Teacher created: teacher@dau.edu.vn / teacher123');
    }

    // 2. Create Student Account
    console.log('\n👨‍🎓 Creating Student Account...');
    let student = await User.findOne({ email: 'student@dau.edu.vn' });
    
    if (student) {
      console.log('   ⚠️  Student already exists');
    } else {
      const hashedPassword = await bcrypt.hash('student123', 10);
      student = await User.create({
        email: 'student@dau.edu.vn',
        password: hashedPassword,
        name: 'Test Student',
        role: 'student',
        studentId: 'STUDENT001',
        major: 'Computer Science',
        year: 2
      });
      console.log('   ✅ Student created: student@dau.edu.vn / student123');
    }

    // 3. Create/Find Test Course
    console.log('\n📚 Creating Test Course...');
    let course = await Course.findOne({ code: 'TEST101' });
    
    if (course) {
      console.log('   ⚠️  Test course already exists');
    } else {
      course = await Course.create({
        title: 'Test Course for Phase 1',
        code: 'TEST101',
        description: 'This course is for testing Phase 1 features',
        instructor: teacher._id,
        department: 'Computer Science',
        semester: 'Spring 2025',
        year: 2025,
        credits: 3,
        status: 'active',
        enrolledStudents: [student._id]
      });
      console.log(`   ✅ Course created: ${course.code} - ${course.title}`);
      console.log(`   📝 Course ID: ${course._id}`);
    }

    // 4. Enroll student if not enrolled
    if (!course.enrolledStudents.includes(student._id)) {
      course.enrolledStudents.push(student._id);
      await course.save();
      console.log(`   ✅ Student enrolled in course`);
    }

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('✅ TEST ACCOUNTS READY');
    console.log('='.repeat(50));
    console.log('\n📋 Login Credentials:');
    console.log('   Teacher: teacher@dau.edu.vn / teacher123');
    console.log('   Student: student@dau.edu.vn / student123');
    console.log('\n📚 Test Course:');
    console.log(`   Title: ${course.title}`);
    console.log(`   Code: ${course.code}`);
    console.log(`   ID: ${course._id}`);
    console.log('\n🚀 Ready for testing!');
    console.log('   - Run automated tests: node test-phase1.js');
    console.log('   - Manual testing: http://localhost:3000');
    console.log('   - See checklist: PHASE1_TESTING_CHECKLIST.md\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createTestAccounts();
