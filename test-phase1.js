/**
 * PHASE 1 - AUTOMATED API TESTING
 * Tests all backend endpoints for Phase 1 features
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
let authToken = '';
let courseId = '';
let assignmentId = '';
let quizId = '';

// Colors for console
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

// Test results
const results = {
  passed: 0,
  failed: 0,
  total: 0
};

// Helper function
async function test(name, fn) {
  results.total++;
  try {
    await fn();
    console.log(`${colors.green}✅ ${name}${colors.reset}`);
    results.passed++;
  } catch (error) {
    console.log(`${colors.red}❌ ${name}${colors.reset}`);
    console.log(`   Error: ${error.message}`);
    results.failed++;
  }
}

// Test functions
async function testAuth() {
  await test('Login as teacher', async () => {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'teacher@dau.edu.vn',
      password: 'teacher123'
    });
    
    if (!response.data.token) throw new Error('No token received');
    authToken = response.data.token;
    console.log(`   Token: ${authToken.substring(0, 20)}...`);
  });
}

async function testCourses() {
  await test('Get all courses', async () => {
    const response = await axios.get(`${BASE_URL}/courses`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    if (!response.data || response.data.length === 0) {
      throw new Error('No courses found');
    }
    
    courseId = response.data[0]._id;
    console.log(`   Found ${response.data.length} courses, using: ${courseId}`);
  });

  await test('Get course settings', async () => {
    const response = await axios.get(`${BASE_URL}/courses/${courseId}/settings`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    if (!response.data) throw new Error('No settings data');
    console.log(`   Settings loaded for course: ${response.data.name || 'N/A'}`);
  });

  await test('Update course settings', async () => {
    const response = await axios.put(
      `${BASE_URL}/courses/${courseId}/settings`,
      {
        syllabus: '<h1>Test Syllabus</h1><p>Auto-generated for testing</p>',
        courseFormat: 'weekly',
        gradingScheme: {
          scale: 100,
          passingGrade: 50,
          weights: {
            assignments: 40,
            quizzes: 30,
            midterm: 15,
            final: 15
          }
        }
      },
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    
    if (!response.data) throw new Error('Failed to update settings');
    console.log(`   Updated: Format=${response.data.courseFormat}, Passing=${response.data.gradingScheme?.passingGrade}%`);
  });
}

async function testAssignments() {
  await test('Create assignment', async () => {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);
    
    const response = await axios.post(
      `${BASE_URL}/assignments`,
      {
        course: courseId,
        title: 'Test Assignment - Auto Created',
        description: 'This is an automated test assignment',
        dueDate: dueDate.toISOString(),
        maxGrade: 100,
        allowLateSubmissions: true
      },
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    
    if (!response.data || !response.data._id) {
      throw new Error('Assignment not created');
    }
    
    assignmentId = response.data._id;
    console.log(`   Created assignment ID: ${assignmentId}`);
  });

  await test('Get assignment by ID', async () => {
    const response = await axios.get(`${BASE_URL}/assignments/${assignmentId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    if (!response.data || response.data._id !== assignmentId) {
      throw new Error('Assignment not found');
    }
    console.log(`   Title: "${response.data.title}"`);
  });
}

async function testQuizzes() {
  await test('Create quiz with questions', async () => {
    const response = await axios.post(
      `${BASE_URL}/quizzes`,
      {
        course: courseId,
        title: 'Test Quiz - Auto Created',
        description: 'Automated test quiz',
        timeLimit: 30,
        maxAttempts: 2,
        passingScore: 70,
        shuffleQuestions: true,
        shuffleOptions: true,
        questions: [
          {
            type: 'multiple-choice',
            question: 'What is 2 + 2?',
            options: ['3', '4', '5', '6'],
            correctAnswer: '4',
            points: 2
          },
          {
            type: 'true-false',
            question: 'Node.js is a JavaScript runtime.',
            correctAnswer: 'true',
            points: 1
          },
          {
            type: 'short-answer',
            question: 'What does API stand for?',
            correctAnswer: 'Application Programming Interface',
            points: 2
          }
        ],
        status: 'published'
      },
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    
    if (!response.data || !response.data._id) {
      throw new Error('Quiz not created');
    }
    
    quizId = response.data._id;
    console.log(`   Created quiz ID: ${quizId} with ${response.data.questions.length} questions`);
  });

  await test('Get course quizzes', async () => {
    const response = await axios.get(`${BASE_URL}/quizzes/course/${courseId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    if (!response.data || !Array.isArray(response.data)) {
      throw new Error('Failed to get quizzes');
    }
    console.log(`   Found ${response.data.length} quizzes in course`);
  });

  await test('Get quiz by ID', async () => {
    const response = await axios.get(`${BASE_URL}/quizzes/${quizId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    if (!response.data || response.data._id !== quizId) {
      throw new Error('Quiz not found');
    }
    console.log(`   Quiz: "${response.data.title}", Total: ${response.data.totalPoints} points`);
  });
}

async function testGradebook() {
  await test('Get course gradebook', async () => {
    const response = await axios.get(`${BASE_URL}/grades/course/${courseId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    if (!response.data) throw new Error('No gradebook data');
    console.log(`   Loaded gradebook with ${response.data.length || 0} student entries`);
  });

  await test('Get course statistics', async () => {
    const response = await axios.get(`${BASE_URL}/grades/course/${courseId}/statistics`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    if (response.data === undefined) throw new Error('No statistics data');
    console.log(`   Average grade: ${response.data.averageGrade || 0}%`);
  });
}

async function testSubmissions() {
  await test('Get assignment submissions', async () => {
    const response = await axios.get(`${BASE_URL}/submissions/assignment/${assignmentId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    if (!Array.isArray(response.data)) throw new Error('Invalid submissions data');
    console.log(`   Found ${response.data.length} submissions`);
  });
}

// Main test runner
async function runAllTests() {
  console.log(`\n${colors.blue}========================================${colors.reset}`);
  console.log(`${colors.blue}   PHASE 1 - AUTOMATED API TESTING${colors.reset}`);
  console.log(`${colors.blue}========================================${colors.reset}\n`);

  try {
    console.log(`${colors.yellow}🔐 Authentication Tests${colors.reset}`);
    await testAuth();

    console.log(`\n${colors.yellow}📚 Course & Settings Tests${colors.reset}`);
    await testCourses();

    console.log(`\n${colors.yellow}📝 Assignment Tests${colors.reset}`);
    await testAssignments();

    console.log(`\n${colors.yellow}❓ Quiz Tests${colors.reset}`);
    await testQuizzes();

    console.log(`\n${colors.yellow}📊 Gradebook Tests${colors.reset}`);
    await testGradebook();

    console.log(`\n${colors.yellow}📤 Submission Tests${colors.reset}`);
    await testSubmissions();

  } catch (error) {
    console.log(`\n${colors.red}Fatal error: ${error.message}${colors.reset}`);
  }

  // Summary
  console.log(`\n${colors.blue}========================================${colors.reset}`);
  console.log(`${colors.blue}   TEST SUMMARY${colors.reset}`);
  console.log(`${colors.blue}========================================${colors.reset}`);
  console.log(`Total: ${results.total}`);
  console.log(`${colors.green}Passed: ${results.passed}${colors.reset}`);
  console.log(`${colors.red}Failed: ${results.failed}${colors.reset}`);
  console.log(`Pass Rate: ${((results.passed / results.total) * 100).toFixed(1)}%\n`);

  // Test data summary
  if (courseId || assignmentId || quizId) {
    console.log(`${colors.yellow}📋 Test Data Created:${colors.reset}`);
    if (courseId) console.log(`   Course ID: ${courseId}`);
    if (assignmentId) console.log(`   Assignment ID: ${assignmentId}`);
    if (quizId) console.log(`   Quiz ID: ${quizId}`);
    console.log();
  }

  process.exit(results.failed > 0 ? 1 : 0);
}

// Run tests
runAllTests();
