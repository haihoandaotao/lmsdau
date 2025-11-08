const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const User = require('./models/User');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

async function checkUsers() {
  try {
    const users = await User.find().select('name email role');
    
    console.log('\n=== USERS IN DATABASE ===\n');
    
    if (users.length === 0) {
      console.log('❌ No users found in database!');
      console.log('💡 Run: npm run seed');
    } else {
      console.log(`✅ Found ${users.length} users:\n`);
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.name}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Role: ${user.role}`);
        console.log('');
      });
      
      console.log('💡 All passwords are: 123456');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

checkUsers();
