/**
 * CREATE LEARNING CONTENT FOR TEST COURSE
 * Adds modules and lessons for comprehensive Phase 1 testing
 */

require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const Course = require('./models/Course');
const Module = require('./models/Module');

async function createLearningContent() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected\n');

    // Find TEST101 course
    const course = await Course.findOne({ code: 'TEST101' });
    if (!course) {
      throw new Error('TEST101 course not found! Run create-test-accounts.js first.');
    }

    console.log(`📚 Found course: ${course.title} (${course.code})`);
    console.log(`📝 Course ID: ${course._id}\n`);

    // Delete existing modules for this course
    await Module.deleteMany({ course: course._id });
    console.log('🗑️  Cleared existing modules\n');

    // Module 1: Introduction to LMS
    console.log('📖 Creating Module 1: Introduction to LMS...');
    const module1 = await Module.create({
      course: course._id,
      title: 'Module 1: Introduction to LMS',
      description: 'Welcome to the Learning Management System. This module covers the basics.',
      order: 1,
      isPublished: true,
      duration: '30 phút',
      items: [
        {
          title: 'Welcome to the Course',
          type: 'video',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          videoProvider: 'youtube',
          description: 'Introduction video explaining course objectives and structure',
          videoDuration: 300,
          order: 1,
          attachments: [
            {
              title: 'Course Syllabus PDF',
              type: 'pdf',
              url: 'https://example.com/syllabus.pdf',
              size: 2500000
            }
          ]
        },
        {
          title: 'How to Use This Platform',
          type: 'reading',
          content: `
# How to Navigate the LMS

## Dashboard
Your dashboard shows all enrolled courses, recent activities, and upcoming deadlines.

## Course Page
Each course has multiple tabs:
- **Nội dung khóa học**: Learning modules and lessons
- **Tổng quan**: Course overview and announcements
- **Tài nguyên**: Downloadable resources and materials
- **Thảo luận**: Discussion forums for Q&A

## Learning Features
1. **Video Lessons**: Watch lectures with progress tracking
2. **Reading Materials**: Text content and documents
3. **Assignments**: Submit your work with file uploads
4. **Quizzes**: Test your knowledge with auto-grading
5. **Gradebook**: View your scores and progress

## Tips for Success
- Complete lessons in order
- Submit assignments before deadlines
- Participate in discussions
- Check your grades regularly

**Need help?** Contact your instructor or use the support forum.
          `,
          description: 'Step-by-step guide to using the platform',
          readingTime: 10,
          order: 2
        },
        {
          title: 'Setting Your Learning Goals',
          type: 'reading',
          content: '<h2>Learning Goals Worksheet</h2><p>Define your objectives for this course...</p>',
          description: 'Worksheet to define your learning objectives',
          readingTime: 15,
          order: 3,
          attachments: [
            {
              title: 'Goal Setting Template',
              type: 'doc',
              url: 'https://example.com/goals-template.docx',
              size: 1200000
            }
          ]
        }
      ]
    });
    console.log(`✅ Created ${module1.items.length} lessons\n`);

    // Module 2: Core Concepts
    console.log('📖 Creating Module 2: Core Concepts...');
    const module2 = await Module.create({
      course: course._id,
      title: 'Module 2: Core Concepts',
      description: 'Deep dive into fundamental concepts and theories',
      order: 2,
      isPublished: true,
      lessons: [
        {
          title: 'Understanding the Basics',
          type: 'video',
          content: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          description: 'Comprehensive overview of basic concepts',
          duration: 25,
          order: 1
        },
        {
          title: 'Key Principles and Theories',
          type: 'text',
          content: `
# Core Principles

## Principle 1: Active Learning
Active learning involves engaging with the material through:
- Problem-solving exercises
- Group discussions
- Practical applications
- Real-world case studies

## Principle 2: Continuous Assessment
Regular testing helps reinforce knowledge:
- Weekly quizzes
- Mid-term projects
- Final examinations
- Peer reviews

## Principle 3: Collaborative Learning
Learn from peers through:
- Group projects
- Discussion forums
- Study groups
- Peer feedback

## Important Theories

### Theory A: Learning by Doing
Practice makes perfect. Apply concepts immediately after learning them.

### Theory B: Spaced Repetition
Review material at increasing intervals for better retention.

### Theory C: Metacognition
Think about your thinking process to improve learning strategies.

## Summary
These principles form the foundation of effective learning in this course.
          `,
          description: 'Theoretical framework and key concepts',
          duration: 30,
          order: 2,
          resources: [
            {
              title: 'Concept Map',
              type: 'image',
              url: 'https://example.com/concept-map.png',
              size: '850 KB'
            },
            {
              title: 'Reading: Learning Theories',
              type: 'pdf',
              url: 'https://example.com/theories.pdf',
              size: '3.1 MB'
            }
          ]
        },
        {
          title: 'Practical Examples',
          type: 'video',
          content: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          description: 'Real-world examples and case studies',
          duration: 20,
          order: 3
        },
        {
          title: 'Practice Exercise 1',
          type: 'text',
          content: `
# Practice Exercise: Apply Core Concepts

## Objective
Apply the principles learned in this module to solve practical problems.

## Instructions
1. Read the scenario below
2. Identify which principles apply
3. Propose a solution
4. Justify your approach

## Scenario
You are managing a project team of 5 members. The team needs to learn a new technology within 2 weeks. How would you structure the learning process?

## Questions to Consider
- Which learning principles would you prioritize?
- How would you assess progress?
- What collaborative methods would you use?
- How would you ensure knowledge retention?

## Deliverable
Submit your analysis as an assignment (500-800 words).

## Assessment Criteria
- Understanding of principles (40%)
- Practical application (30%)
- Justification quality (20%)
- Clarity and structure (10%)

**Deadline:** See assignment section
          `,
          description: 'Hands-on exercise to reinforce learning',
          duration: 45,
          order: 4
        }
      ]
    });
    console.log(`✅ Created ${module2.lessons.length} lessons\n`);

    // Module 3: Advanced Topics
    console.log('📖 Creating Module 3: Advanced Topics...');
    const module3 = await Module.create({
      course: course._id,
      title: 'Module 3: Advanced Topics',
      description: 'Advanced concepts and real-world applications',
      order: 3,
      isPublished: true,
      lessons: [
        {
          title: 'Advanced Techniques',
          type: 'video',
          content: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          description: 'Professional-level techniques and best practices',
          duration: 35,
          order: 1,
          resources: [
            {
              title: 'Advanced Guide PDF',
              type: 'pdf',
              url: 'https://example.com/advanced-guide.pdf',
              size: '4.8 MB'
            },
            {
              title: 'Code Examples',
              type: 'zip',
              url: 'https://example.com/examples.zip',
              size: '12.5 MB'
            }
          ]
        },
        {
          title: 'Industry Case Studies',
          type: 'text',
          content: `
# Real-World Case Studies

## Case Study 1: Tech Startup Success
**Company:** InnovateTech Inc.
**Challenge:** Rapid scaling with limited resources
**Solution:** Implemented agile learning methodology
**Results:** 
- 300% productivity increase
- 85% employee satisfaction
- $5M funding secured

**Key Takeaways:**
- Continuous learning culture
- Peer mentorship programs
- Regular skill assessments

---

## Case Study 2: Traditional Business Transformation
**Company:** Legacy Corp
**Challenge:** Digital transformation resistance
**Solution:** Structured training programs
**Results:**
- 70% digital adoption
- 40% cost reduction
- New revenue streams

**Lessons Learned:**
- Change management is crucial
- Hands-on training works best
- Executive buy-in essential

---

## Case Study 3: Remote Team Excellence
**Company:** GlobalWork Solutions
**Challenge:** Distributed team collaboration
**Solution:** Virtual learning ecosystem
**Results:**
- 95% team engagement
- 60% faster onboarding
- 20 countries connected

**Success Factors:**
- Async learning materials
- Regular virtual sessions
- Strong documentation

## Your Turn
Analyze one of these cases and identify how the concepts from Modules 1-2 apply.
          `,
          description: 'Learn from successful real-world implementations',
          duration: 40,
          order: 2
        },
        {
          title: 'Workshop: Build Your Own Project',
          type: 'video',
          content: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          description: 'Step-by-step workshop to create a practical project',
          duration: 60,
          order: 3
        }
      ]
    });
    console.log(`✅ Created ${module3.lessons.length} lessons\n`);

    // Module 4: Assessment & Review
    console.log('📖 Creating Module 4: Assessment & Review...');
    const module4 = await Module.create({
      course: course._id,
      title: 'Module 4: Assessment & Review',
      description: 'Test your knowledge and review key concepts',
      order: 4,
      isPublished: true,
      lessons: [
        {
          title: 'Comprehensive Review',
          type: 'text',
          content: `
# Course Review: Key Concepts Summary

## Module 1 Recap: Introduction
- Platform navigation
- Learning tools overview
- Goal setting strategies
- **Quiz Score Required:** 70%+

## Module 2 Recap: Core Concepts
- Active learning principles
- Assessment strategies
- Collaborative methods
- Key theories application
- **Assignment Completed:** ✓

## Module 3 Recap: Advanced Topics
- Professional techniques
- Industry case studies
- Practical project work
- **Project Submission:** Required

## Final Exam Topics
The final exam covers:
1. **Fundamentals** (25%) - Modules 1-2
2. **Application** (35%) - Case studies & examples
3. **Analysis** (25%) - Critical thinking
4. **Synthesis** (15%) - Create solutions

## Exam Format
- **Multiple Choice:** 20 questions (40%)
- **Short Answer:** 5 questions (30%)
- **Essay:** 2 questions (30%)
- **Duration:** 120 minutes
- **Passing Score:** 70%

## Study Tips
1. Review all video lessons
2. Redo practice exercises
3. Study case studies carefully
4. Prepare for essay questions
5. Manage your time effectively

## Resources for Review
- All lesson materials available
- Discussion forum for Q&A
- Office hours: Tue/Thu 2-4 PM
- Study guide in resources tab

**Good luck on your assessment!**
          `,
          description: 'Comprehensive review of all course materials',
          duration: 45,
          order: 1,
          resources: [
            {
              title: 'Study Guide',
              type: 'pdf',
              url: 'https://example.com/study-guide.pdf',
              size: '2.8 MB'
            },
            {
              title: 'Practice Questions',
              type: 'pdf',
              url: 'https://example.com/practice-exam.pdf',
              size: '1.5 MB'
            }
          ]
        },
        {
          title: 'Final Assessment Instructions',
          type: 'video',
          content: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          description: 'What to expect in the final exam',
          duration: 15,
          order: 2
        },
        {
          title: 'Course Feedback Survey',
          type: 'document',
          content: 'https://forms.google.com/feedback-survey',
          description: 'Help us improve the course with your feedback',
          duration: 10,
          order: 3
        }
      ]
    });
    console.log(`✅ Created ${module4.lessons.length} lessons\n`);

    // Summary
    console.log('='.repeat(60));
    console.log('✅ LEARNING CONTENT CREATED SUCCESSFULLY');
    console.log('='.repeat(60));
    console.log(`\n📚 Course: ${course.title}`);
    console.log(`📝 Total Modules: 4`);
    console.log(`📖 Total Lessons: ${module1.lessons.length + module2.lessons.length + module3.lessons.length + module4.lessons.length}`);
    
    console.log('\n📋 Module Summary:');
    console.log(`  1. Introduction to LMS - ${module1.lessons.length} lessons`);
    console.log(`  2. Core Concepts - ${module2.lessons.length} lessons`);
    console.log(`  3. Advanced Topics - ${module3.lessons.length} lessons`);
    console.log(`  4. Assessment & Review - ${module4.lessons.length} lessons`);

    console.log('\n🎯 Content Types:');
    console.log('  - Video lessons with YouTube links');
    console.log('  - Text content with Markdown formatting');
    console.log('  - Document links (Google Docs, PDFs)');
    console.log('  - Downloadable resources');
    console.log('  - Practice exercises');

    console.log('\n🔄 REFRESH YOUR BROWSER to see the content!');
    console.log('📱 Go to: http://localhost:3000');
    console.log('👉 Click "Nội dung khóa học" tab\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createLearningContent();
