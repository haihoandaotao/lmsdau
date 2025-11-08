// Debug script to check environment and files
const fs = require('fs');
const path = require('path');

console.log('=== ENVIRONMENT CHECK ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'SET' : 'NOT SET');
console.log('');

console.log('=== FILE SYSTEM CHECK ===');
const frontendBuildPath = path.join(__dirname, '..', 'frontend', 'build');
console.log('Frontend build path:', frontendBuildPath);
console.log('Build folder exists:', fs.existsSync(frontendBuildPath));

if (fs.existsSync(frontendBuildPath)) {
  console.log('Build folder contents:');
  const files = fs.readdirSync(frontendBuildPath);
  files.forEach(file => console.log('  -', file));
  
  const indexPath = path.join(frontendBuildPath, 'index.html');
  console.log('');
  console.log('index.html exists:', fs.existsSync(indexPath));
} else {
  console.log('❌ BUILD FOLDER NOT FOUND!');
}
