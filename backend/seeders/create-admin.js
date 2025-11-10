const mongoose = require('mongoose');
const User = require('../models/User');
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

const createAdmin = async () => {
  try {
    await connectDB();

    // Check if admin exists
    const existingAdmin = await User.findOne({ email: 'admin@dau.edu.vn' });
    
    if (existingAdmin) {
      console.log('⚠️  Admin already exists');
      console.log('Email:', existingAdmin.email);
      console.log('Name:', existingAdmin.name);
      console.log('Role:', existingAdmin.role);
      
      // Update password
      existingAdmin.password = 'admin123';
      await existingAdmin.save();
      console.log('✅ Admin password updated to: admin123');
    } else {
      // Create new admin
      const admin = await User.create({
        name: 'Admin LMS',
        email: 'admin@dau.edu.vn',
        password: 'admin123',
        role: 'admin',
        department: 'Quản trị hệ thống'
      });
      
      console.log('✅ Admin created successfully!');
      console.log('Email:', admin.email);
      console.log('Password: admin123');
      console.log('Role:', admin.role);
    }

    // Check student account
    const student = await User.findOne({ email: 'student@example.com' });
    if (student) {
      console.log('\n✅ Student account exists');
      console.log('Email:', student.email);
      student.password = 'password123';
      await student.save();
      console.log('✅ Student password updated to: password123');
    }

    console.log('\n🎉 DONE!');
    console.log('\n📋 Login credentials:');
    console.log('   Admin:   admin@dau.edu.vn / admin123');
    console.log('   Student: student@example.com / password123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

createAdmin();
