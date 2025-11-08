const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { seedModules } = require('./moduleSeeder');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ Connected to MongoDB');
  return seedModules();
})
.then(() => {
  console.log('\n🎉 Module seeding completed!');
  process.exit(0);
})
.catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
