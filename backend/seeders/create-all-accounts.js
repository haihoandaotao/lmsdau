const mongoose = require('mongoose');
const User = require('../models/User');
const Major = require('../models/Major');
const Curriculum = require('../models/Curriculum');
require('dotenv').config();

const createStudentAccount = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find CNTT major and curriculum
    const cnttMajor = await Major.findOne({ code: 'CNTT' });
    const curriculum = await Curriculum.findOne({ major: cnttMajor?._id });

    // Check if student exists
    let student = await User.findOne({ email: 'student@example.com' });
    
    if (student) {
      console.log('⚠️  Student account exists, updating...');
      student.password = 'password123';
      student.name = 'Nguyễn Văn A';
      student.role = 'student';
      student.department = 'Công nghệ Thông tin';
      if (cnttMajor) student.major = cnttMajor._id;
      if (curriculum) student.curriculum = curriculum._id;
      student.admissionYear = 2024;
      student.studentClass = 'CNTT01';
      await student.save();
      console.log('✅ Student updated!');
    } else {
      // Create new student
      student = await User.create({
        name: 'Nguyễn Văn A',
        email: 'student@example.com',
        password: 'password123',
        role: 'student',
        department: 'Công nghệ Thông tin',
        major: cnttMajor?._id,
        curriculum: curriculum?._id,
        admissionYear: 2024,
        studentClass: 'CNTT01'
      });
      console.log('✅ Student created!');
    }

    console.log('\n📋 Student Info:');
    console.log('Name:', student.name);
    console.log('Email:', student.email);
    console.log('Password: password123');
    console.log('Role:', student.role);
    console.log('Major:', cnttMajor ? cnttMajor.name : 'N/A');
    console.log('Curriculum:', curriculum ? curriculum.name : 'N/A');

    // Create teacher account
    let teacher = await User.findOne({ email: 'teacher@example.com' });
    
    if (teacher) {
      teacher.password = 'password123';
      await teacher.save();
      console.log('\n✅ Teacher password updated');
    } else {
      teacher = await User.create({
        name: 'Giảng viên Demo',
        email: 'teacher@example.com',
        password: 'password123',
        role: 'teacher',
        department: 'Công nghệ Thông tin'
      });
      console.log('\n✅ Teacher created');
    }

    console.log('\n🎉 ALL ACCOUNTS READY!');
    console.log('\n📋 Login Credentials:');
    console.log('   Admin:   admin@dau.edu.vn / admin123');
    console.log('   Student: student@example.com / password123');
    console.log('   Teacher: teacher@example.com / password123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

createStudentAccount();
