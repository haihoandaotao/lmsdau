const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Course = require('./models/Course');
const Module = require('./models/Module');

async function checkData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const users = await User.find().select('name email role');
    const courses = await Course.find().select('title code instructor').populate('instructor', 'name');
    const modules = await Module.find().populate('course', 'title').select('title course itemCount');

    console.log('=== 👥 USERS ===');
    users.forEach(u => {
      console.log(`${u.role.toUpperCase()}: ${u.email} (${u.name})`);
    });

    console.log('\n=== 📚 COURSES ===');
    courses.forEach(c => {
      console.log(`[${c.code}] ${c.title}`);
      console.log(`   👨‍🏫 Giảng viên: ${c.instructor?.name || 'N/A'}`);
    });

    console.log('\n=== 📖 MODULES ===');
    modules.forEach(m => {
      console.log(`- ${m.title} (${m.itemCount} items) - Course: ${m.course?.title || 'N/A'}`);
    });

    console.log('\n✅ Data check completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkData();
