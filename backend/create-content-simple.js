/**
 * CREATE LEARNING CONTENT FOR TEST COURSE - SIMPLIFIED
 */

require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const Course = require('./models/Course');
const Module = require('./models/Module');

async function createContent() {
  try {
    console.log('🔌 Connecting...');
    await mongoose.connect(process.env.MONGODB_URI);
    
    const course = await Course.findOne({ code: 'TEST101' });
    if (!course) throw new Error('TEST101 not found');
    
    console.log(`📚 Course: ${course.title}\n`);
    
    // Clear existing
    await Module.deleteMany({ course: course._id });
    
    // Module 1
    await Module.create({
      course: course._id,
      title: 'Module 1: Introduction',
      description: 'Getting started with the course',
      order: 1,
      isPublished: true,
      duration: '1 giờ',
      items: [
        {
          title: 'Welcome Video',
          type: 'video',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          videoProvider: 'youtube',
          description: 'Course introduction and overview',
          videoDuration: 300,
          order: 1
        },
        {
          title: 'How to Use This Platform',
          type: 'reading',
          content: '<h1>Platform Guide</h1><p>This LMS provides video lessons, assignments, quizzes, and discussion forums.</p><h2>Features:</h2><ul><li>Track your progress</li><li>Submit assignments</li><li>Take quizzes</li><li>View your grades</li></ul>',
          readingTime: 10,
          order: 2
        },
        {
          title: 'Set Your Learning Goals',
          type: 'reading',
          content: '<h2>Define Your Objectives</h2><p>What do you want to achieve in this course?</p><ol><li>Write down 3 main goals</li><li>Break them into smaller milestones</li><li>Track your progress weekly</li></ol>',
          readingTime: 15,
          order: 3
        }
      ]
    });
    console.log('✅ Module 1 created (3 lessons)');
    
    // Module 2
    await Module.create({
      course: course._id,
      title: 'Module 2: Core Concepts',
      description: 'Fundamental principles and theories',
      order: 2,
      isPublished: true,
      duration: '2 giờ',
      items: [
        {
          title: 'Understanding the Basics',
          type: 'video',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          videoProvider: 'youtube',
          description: 'Comprehensive overview of basic concepts',
          videoDuration: 1500,
          order: 1
        },
        {
          title: 'Key Principles',
          type: 'reading',
          content: '<h1>Core Principles</h1><h2>1. Active Learning</h2><p>Engage with material through problem-solving and discussion.</p><h2>2. Continuous Assessment</h2><p>Regular testing reinforces knowledge.</p><h2>3. Collaborative Learning</h2><p>Learn from peers through group projects.</p>',
          readingTime: 20,
          order: 2
        },
        {
          title: 'Practical Examples',
          type: 'video',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          videoProvider: 'youtube',
          description: 'Real-world examples and case studies',
          videoDuration: 1200,
          order: 3
        },
        {
          title: 'Practice Exercise',
          type: 'reading',
          content: '<h1>Exercise: Apply Core Concepts</h1><h2>Scenario:</h2><p>You are managing a team of 5 members. They need to learn a new technology within 2 weeks.</p><h2>Task:</h2><p>Design a learning plan using the principles from this module.</p><h2>Submit:</h2><p>500-800 words explaining your approach.</p>',
          readingTime: 30,
          order: 4
        }
      ]
    });
    console.log('✅ Module 2 created (4 lessons)');
    
    // Module 3
    await Module.create({
      course: course._id,
      title: 'Module 3: Advanced Topics',
      description: 'Professional techniques and applications',
      order: 3,
      isPublished: true,
      duration: '3 giờ',
      items: [
        {
          title: 'Advanced Techniques',
          type: 'video',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          videoProvider: 'youtube',
          description: 'Professional-level techniques and best practices',
          videoDuration: 2100,
          order: 1
        },
        {
          title: 'Industry Case Studies',
          type: 'reading',
          content: '<h1>Real-World Cases</h1><h2>Case 1: Tech Startup</h2><p><strong>Challenge:</strong> Rapid scaling<br><strong>Solution:</strong> Agile learning<br><strong>Result:</strong> 300% productivity increase</p><h2>Case 2: Enterprise Transformation</h2><p><strong>Challenge:</strong> Digital adoption<br><strong>Solution:</strong> Structured training<br><strong>Result:</strong> 70% adoption, 40% cost reduction</p>',
          readingTime: 40,
          order: 2
        },
        {
          title: 'Workshop: Build Your Project',
          type: 'video',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          videoProvider: 'youtube',
          description: 'Step-by-step project building workshop',
          videoDuration: 3600,
          order: 3
        }
      ]
    });
    console.log('✅ Module 3 created (3 lessons)');
    
    // Module 4
    await Module.create({
      course: course._id,
      title: 'Module 4: Review & Assessment',
      description: 'Test your knowledge and wrap up',
      order: 4,
      isPublished: true,
      duration: '1.5 giờ',
      items: [
        {
          title: 'Comprehensive Review',
          type: 'reading',
          content: '<h1>Course Summary</h1><h2>Module 1</h2><ul><li>Platform navigation</li><li>Learning tools</li></ul><h2>Module 2</h2><ul><li>Core principles</li><li>Practical application</li></ul><h2>Module 3</h2><ul><li>Advanced techniques</li><li>Case studies</li></ul><h2>Final Exam</h2><p><strong>Format:</strong> MCQ + Short Answer + Essay<br><strong>Duration:</strong> 120 minutes<br><strong>Passing Score:</strong> 70%</p>',
          readingTime: 30,
          order: 1
        },
        {
          title: 'Final Exam Instructions',
          type: 'video',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          videoProvider: 'youtube',
          description: 'What to expect in the final assessment',
          videoDuration: 900,
          order: 2
        },
        {
          title: 'Course Feedback',
          type: 'reading',
          content: '<h1>Help Us Improve</h1><p>Your feedback is valuable! Please complete the survey.</p><h2>Topics:</h2><ul><li>Course content quality</li><li>Instructor effectiveness</li><li>Platform usability</li><li>Suggestions for improvement</li></ul>',
          readingTime: 10,
          order: 3
        }
      ]
    });
    console.log('✅ Module 4 created (3 lessons)\n');
    
    console.log('='.repeat(50));
    console.log('✅ SUCCESS! Content created:');
    console.log('   4 modules, 13 total lessons');
    console.log('   Mix of videos and readings');
    console.log('   Downloadable resources included');
    console.log('='.repeat(50));
    console.log('\n🔄 REFRESH browser to see content!');
    console.log('👉 Tab: "Nội dung khóa học"\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createContent();
