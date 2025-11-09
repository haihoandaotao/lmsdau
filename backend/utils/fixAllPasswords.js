const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const fixAllPasswords = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get all users
    const users = await User.find({}).select('+password');
    console.log(`\n📊 Found ${users.length} users\n`);

    for (const user of users) {
      console.log(`Processing: ${user.email} (${user.role})`);
      
      // Set password to plain text '123456'
      // Pre-save hook will hash it automatically
      user.password = '123456';
      await user.save();
      
      console.log(`✅ Reset password for ${user.email}`);
    }

    console.log('\n✅ All passwords reset to: 123456\n');
    
    // Test login for each user
    console.log('🧪 Testing logins...\n');
    
    for (const user of users) {
      const testUser = await User.findOne({ email: user.email }).select('+password');
      const isMatch = await testUser.comparePassword('123456');
      
      console.log(`${isMatch ? '✅' : '❌'} ${user.email} - ${isMatch ? 'PASS' : 'FAIL'}`);
    }

    mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

fixAllPasswords();
