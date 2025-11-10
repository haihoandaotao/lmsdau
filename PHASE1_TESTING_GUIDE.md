# PHASE 1 COMPREHENSIVE TESTING GUIDE

## 🎯 Testing Scope
Test all 4 Priority 1 features with integration points.

---

## 🔧 Prerequisites

### Backend Running
- ✅ Port: 5000
- ✅ MongoDB: Connected
- ✅ Routes: All registered

### Frontend Running
- ✅ Port: 3000
- ✅ No compilation errors
- ✅ All pages loaded

### Test Accounts
```
Teacher/Admin:
- Email: teacher@dau.edu.vn
- Password: teacher123

Student:
- Email: student@dau.edu.vn  
- Password: student123
```

---

## 📋 TEST PLAN

### 1️⃣ COURSE SETTINGS & SYLLABUS TEST

#### Test 1.1: Access Course Settings (Teacher)
**Steps:**
1. Login as teacher@dau.edu.vn
2. Navigate to Courses → Select any course
3. Click "Cài đặt khóa học" button
4. Verify CourseSettings page loads

**Expected Results:**
- ✅ 4 tabs visible: Thông tin chung, Đề cương, Thang điểm, Truy cập
- ✅ All fields populated with existing data
- ✅ No console errors

#### Test 1.2: Update General Settings
**Steps:**
1. Switch to "Thông tin chung" tab
2. Change course format to "Theo tuần"
3. Set start date: 2025-01-15
4. Set end date: 2025-05-30
5. Add objective: "Hiểu các khái niệm cơ bản về lập trình"
6. Click "Lưu thay đổi"

**Expected Results:**
- ✅ Success snackbar appears
- ✅ Redirected to course detail
- ✅ Settings saved to database

#### Test 1.3: Update Syllabus with Rich Text
**Steps:**
1. Go back to Settings
2. Switch to "Đề cương (Syllabus)" tab
3. Add rich text content:
   - Header: "# Nội dung khóa học"
   - Bold text, lists, links
4. Click "Lưu thay đổi"

**Expected Results:**
- ✅ Rich text editor works (toolbar functional)
- ✅ Formatting preserved
- ✅ HTML saved correctly

#### Test 1.4: Configure Grading Scheme
**Steps:**
1. Switch to "Thang điểm" tab
2. Set weights:
   - Bài tập: 40%
   - Quiz: 30%
   - Giữa kỳ: 15%
   - Cuối kỳ: 15%
3. Verify total = 100%
4. Set passing grade: 55%
5. Save

**Expected Results:**
- ✅ Total weight chip shows 100% (green)
- ✅ No warning alerts
- ✅ Settings saved

#### Test 1.5: Invalid Weight Configuration
**Steps:**
1. Set weights totaling 95%
2. Try to save

**Expected Results:**
- ⚠️ Warning alert: "Tổng tỷ trọng phải bằng 100%"
- ⚠️ Total weight chip shows 95% (red)
- ✅ Can still save (warning only)

#### Test 1.6: Access Settings Configuration
**Steps:**
1. Switch to "Truy cập" tab
2. Set visibility: "Riêng tư"
3. Set enrollment key: "DAU2025"
4. Enable guest access
5. Save

**Expected Results:**
- ✅ All settings saved
- ✅ Enrollment key required for enrollment

---

### 2️⃣ ASSIGNMENT SUBMISSION TEST

#### Test 2.1: Create Assignment (Teacher)
**Steps:**
1. Login as teacher
2. Go to course → Assignments
3. Click "Tạo bài tập mới"
4. Fill:
   - Title: "Bài tập tuần 1"
   - Description: "Làm bài tập về Python basics"
   - Max grade: 100
   - Due date: Next week
5. Submit

**Expected Results:**
- ✅ Assignment created
- ✅ Visible in assignments list

#### Test 2.2: Submit Assignment with Files (Student)
**Steps:**
1. Login as student
2. Navigate to the assignment
3. Click "Nộp bài tập"
4. Enter content: "Đây là bài làm của em"
5. Upload files:
   - 1 PDF file (< 50MB)
   - 1 Python file (.py)
   - 1 Image file
6. Click "Nộp bài"

**Expected Results:**
- ✅ All files accepted (within limits)
- ✅ Success message: "Nộp bài thành công"
- ✅ Files list shows with sizes
- ✅ Submission date recorded

#### Test 2.3: Resubmit Assignment
**Steps:**
1. Return to assignment detail
2. Click "Nộp lại bài tập"
3. Change content
4. Add 1 more file
5. Submit

**Expected Results:**
- ✅ Attempt number increases
- ✅ Previous submission saved in history
- ✅ New submission replaces current

#### Test 2.4: File Upload Validation
**Steps:**
1. Try to upload file > 50MB
2. Try to upload 11 files at once
3. Try unsupported file type (.exe)

**Expected Results:**
- ❌ Error: "File quá lớn (tối đa 50MB)"
- ❌ Error: "Chỉ được upload tối đa 10 files"
- ❌ Error: "File type không được hỗ trợ"

#### Test 2.5: Grade Assignment (Teacher)
**Steps:**
1. Login as teacher
2. Go to assignment → "Xem tất cả bài nộp"
3. View submission list
4. Click grade button for a student
5. Enter grade: 85
6. Enter feedback: "Làm tốt! Cần cải thiện phần 3"
7. Submit grade

**Expected Results:**
- ✅ Grade saved
- ✅ Feedback visible to student
- ✅ **Gradebook entry auto-created**
- ✅ Statistics updated (graded count +1)

#### Test 2.6: View Graded Assignment (Student)
**Steps:**
1. Login as student
2. Go to assignment detail
3. View submission status

**Expected Results:**
- ✅ Status shows "Đã chấm"
- ✅ Grade displayed: 85/100
- ✅ Feedback visible
- ✅ Files still downloadable

#### Test 2.7: Late Submission Detection
**Steps:**
1. Create assignment with due date = yesterday
2. Student submits today

**Expected Results:**
- ⚠️ Late warning shown before submit
- ✅ Submission marked as "Nộp trễ"
- ✅ Late badge visible in teacher view

#### Test 2.8: Submission Statistics
**Steps:**
1. Teacher views submissions list
2. Check statistics cards

**Expected Results:**
- ✅ Total students count correct
- ✅ Submitted count correct
- ✅ Graded count correct
- ✅ Average grade calculated
- ✅ Pie chart displays distribution

---

### 3️⃣ QUIZ BUILDER & AUTO-GRADING TEST

#### Test 3.1: Create Quiz with Multiple Question Types (Teacher)
**Steps:**
1. Login as teacher
2. Go to course → Quizzes
3. Click "Tạo Quiz mới"
4. Fill basic info:
   - Title: "Quiz Python Basics"
   - Time limit: 30 minutes
   - Max attempts: 2
   - Passing score: 70%
5. Add questions:
   
   **Question 1 (MCQ):**
   - Question: "Python là ngôn ngữ gì?"
   - Options:
     * ✅ Compiled (correct)
     * Interpreted
     * Assembly
     * Machine code
   - Points: 2
   
   **Question 2 (True/False):**
   - Question: "Python hỗ trợ OOP"
   - Answer: True ✅
   - Points: 1
   
   **Question 3 (Short Answer):**
   - Question: "Hàm in ra màn hình trong Python?"
   - Accepted: ["print", "Print"]
   - Case sensitive: No
   - Points: 2
   
   **Question 4 (Essay):**
   - Question: "Giải thích sự khác biệt giữa list và tuple"
   - Points: 5
   
6. Click "Xuất bản"

**Expected Results:**
- ✅ All question types saved
- ✅ Total points = 10
- ✅ Quiz status = "published"
- ✅ Visible to students

#### Test 3.2: Validation Tests (Teacher)
**Steps:**
1. Try to publish without title
2. Try to publish without questions
3. Try to publish MCQ without correct answer
4. Try to publish short answer without accepted answers

**Expected Results:**
- ❌ "Vui lòng nhập tiêu đề quiz"
- ❌ "Vui lòng thêm ít nhất 1 câu hỏi"
- ❌ "Vui lòng đánh dấu đáp án đúng"
- ❌ "Vui lòng nhập ít nhất 1 đáp án đúng"

#### Test 3.3: Take Quiz with Timer (Student)
**Steps:**
1. Login as student
2. Navigate to Quizzes
3. Click "Bắt đầu" on the quiz
4. Verify timer starts counting down
5. Answer questions:
   - Q1: Select wrong answer
   - Q2: True
   - Q3: Type "print"
   - Q4: Write essay (100 words)
6. Navigate between questions using chips
7. Click "Nộp bài"

**Expected Results:**
- ✅ Timer counts down from 30:00
- ✅ Progress bar updates (4/4 answered)
- ✅ Question chips show checkmarks
- ✅ Confirmation dialog appears
- ✅ Submit successful

#### Test 3.4: Auto-Grading Results (Student)
**Steps:**
1. View results immediately after submit
2. Check score breakdown

**Expected Results:**
- ✅ Q1: Wrong (0/2 points) - MCQ auto-graded
- ✅ Q2: Correct (1/1 point) - True/False auto-graded  
- ✅ Q3: Correct (2/2 points) - Short answer auto-graded
- ✅ Q4: "Đang chờ chấm" - Essay needs manual grading
- ✅ Partial score: 3/10 (30%)
- ✅ Status: "Chưa đạt" (< 70%)
- ✅ Correct answers shown (if settings allow)

#### Test 3.5: Manual Grade Essay (Teacher)
**Steps:**
1. Login as teacher
2. Go to quiz → "Xem bài làm"
3. Find student attempt
4. Click grade essay question
5. Enter points: 4/5
6. Enter feedback: "Giải thích tốt nhưng thiếu ví dụ"
7. Submit grade

**Expected Results:**
- ✅ Essay graded successfully
- ✅ Total score updated: 7/10 (70%)
- ✅ Status changes to "Đạt" (= 70%)
- ✅ **Gradebook entry auto-created**
- ✅ Feedback visible to student

#### Test 3.6: Retake Quiz (Student)
**Steps:**
1. Student returns to quiz
2. Click "Làm lại"
3. Answer all correctly this time
4. Submit

**Expected Results:**
- ✅ Attempt number = 2
- ✅ New score: 8/10 (80%)
- ✅ Best score tracked
- ✅ Can view both attempts

#### Test 3.7: Max Attempts Limit
**Steps:**
1. Student tries 3rd attempt

**Expected Results:**
- ❌ "Bạn đã hết lượt làm bài (2 lần)"
- ✅ Can only view results

#### Test 3.8: Auto-Submit on Timeout
**Steps:**
1. Create quiz with 2 minute limit
2. Student starts quiz
3. Wait for timer to reach 0:00

**Expected Results:**
- ✅ Quiz auto-submits
- ✅ Message: "Hết giờ! Bài đã được nộp tự động"
- ✅ All answered questions saved
- ✅ Unanswered = 0 points

#### Test 3.9: Question/Option Shuffling
**Steps:**
1. Teacher enables "Xáo trộn câu hỏi" and "Xáo trộn đáp án"
2. Student 1 takes quiz
3. Student 2 takes quiz
4. Compare question order

**Expected Results:**
- ✅ Questions in different order
- ✅ MCQ options in different order
- ✅ Correct answers still work

---

### 4️⃣ GRADEBOOK INTEGRATION TEST

#### Test 4.1: Auto-Create from Assignment (Integration)
**Steps:**
1. Teacher grades assignment (grade: 85/100)
2. Student checks gradebook

**Expected Results:**
- ✅ Grade item appears: type="assignment"
- ✅ Score: 85/100
- ✅ Weight: 1 (or from course settings)
- ✅ Submitted date recorded
- ✅ Counted in total grade calculation

#### Test 4.2: Auto-Create from Quiz (Integration)
**Steps:**
1. Student completes quiz (score: 7/10)
2. Teacher manually grades essay
3. Student checks gradebook

**Expected Results:**
- ✅ Grade item appears: type="quiz"
- ✅ Score: 7/10
- ✅ Weight: 1
- ✅ Completed date recorded
- ✅ Counted in total grade calculation

#### Test 4.3: Weighted Calculation (Integration)
**Steps:**
1. Course settings: 
   - Assignments: 40%
   - Quizzes: 30%
   - Midterm: 15%
   - Final: 15%
2. Student has:
   - 2 assignments: 85, 90 (avg = 87.5)
   - 1 quiz: 70
3. Check total grade

**Expected Results:**
- ✅ Assignment contribution: 87.5 × 0.4 = 35
- ✅ Quiz contribution: 70 × 0.3 = 21
- ✅ Total: 56% (before midterm/final)
- ✅ Letter grade calculated correctly

#### Test 4.4: View Gradebook (Teacher)
**Steps:**
1. Teacher navigates to course → "Bảng điểm"
2. View all students' grades

**Expected Results:**
- ✅ Table shows all students
- ✅ Columns: Name, Email, Items, Total, Letter, Status
- ✅ Grade items count correct per student
- ✅ Total percentage calculated
- ✅ Letter grades A-F assigned
- ✅ Pass/Fail status based on threshold

#### Test 4.5: View My Grades (Student)
**Steps:**
1. Student navigates to course → "Điểm của tôi"
2. View grade breakdown

**Expected Results:**
- ✅ Overview card shows total %
- ✅ Letter grade displayed
- ✅ Pass/Fail status shown
- ✅ Grade items table lists all grades
- ✅ Bar chart shows score distribution
- ✅ Trend line chart (if multiple items)

#### Test 4.6: Filter and Sort (Teacher)
**Steps:**
1. In gradebook, filter by status: "Đạt"
2. Sort by total grade (descending)
3. Search by student name

**Expected Results:**
- ✅ Only passing students shown
- ✅ Sorted correctly
- ✅ Search works instantly
- ✅ Results count updates

#### Test 4.7: Export CSV (Teacher)
**Steps:**
1. Click "Xuất CSV" button
2. Open downloaded file

**Expected Results:**
- ✅ File downloads: `gradebook_[coursecode]_[date].csv`
- ✅ Contains: Student info, grades, totals
- ✅ UTF-8 encoded (Vietnamese characters correct)
- ✅ Importable to Excel

#### Test 4.8: Statistics Display (Teacher)
**Steps:**
1. View gradebook statistics section

**Expected Results:**
- ✅ Average grade calculated
- ✅ Highest/lowest grades shown
- ✅ Pass rate percentage
- ✅ Grade distribution chart

---

### 5️⃣ END-TO-END INTEGRATION TEST

#### Test 5.1: Complete Student Journey
**Steps:**
1. Student enrolls in course
2. Views syllabus in course settings
3. Completes assignment → gets graded
4. Takes quiz → gets auto-graded + manual essay grade
5. Checks gradebook for both grades
6. Views total weighted score

**Expected Results:**
- ✅ All features work together
- ✅ Gradebook reflects both sources
- ✅ Weighted calculation correct
- ✅ Progress tracked accurately

#### Test 5.2: Complete Teacher Journey
**Steps:**
1. Teacher updates course settings
2. Creates assignment
3. Creates quiz
4. Grades submissions
5. Grades essay questions
6. Views gradebook
7. Exports grades
8. Reviews statistics

**Expected Results:**
- ✅ All teacher features functional
- ✅ No permission errors
- ✅ Data consistency across features
- ✅ Reports accurate

---

## 🐛 BUG TRACKING

### Critical Bugs
- [ ] None found

### Major Bugs
- [ ] None found

### Minor Bugs
- [ ] None found

### UI/UX Issues
- [ ] None found

---

## ✅ TEST RESULTS SUMMARY

### Feature 1: Course Settings & Syllabus
- [ ] 1.1 Access Settings
- [ ] 1.2 Update General
- [ ] 1.3 Update Syllabus
- [ ] 1.4 Configure Grading
- [ ] 1.5 Invalid Weight
- [ ] 1.6 Access Settings

### Feature 2: Assignment Submission
- [ ] 2.1 Create Assignment
- [ ] 2.2 Submit with Files
- [ ] 2.3 Resubmit
- [ ] 2.4 File Validation
- [ ] 2.5 Grade Assignment
- [ ] 2.6 View Graded
- [ ] 2.7 Late Detection
- [ ] 2.8 Statistics

### Feature 3: Quiz System
- [ ] 3.1 Create Quiz
- [ ] 3.2 Validation
- [ ] 3.3 Take Quiz
- [ ] 3.4 Auto-Grading
- [ ] 3.5 Manual Grade
- [ ] 3.6 Retake
- [ ] 3.7 Max Attempts
- [ ] 3.8 Auto-Submit
- [ ] 3.9 Shuffling

### Feature 4: Gradebook
- [ ] 4.1 Assignment Integration
- [ ] 4.2 Quiz Integration
- [ ] 4.3 Weighted Calculation
- [ ] 4.4 Teacher View
- [ ] 4.5 Student View
- [ ] 4.6 Filter/Sort
- [ ] 4.7 Export CSV
- [ ] 4.8 Statistics

### Feature 5: E2E Integration
- [ ] 5.1 Student Journey
- [ ] 5.2 Teacher Journey

---

## 📊 TEST METRICS

- **Total Test Cases:** 43
- **Passed:** 0
- **Failed:** 0
- **Blocked:** 0
- **Pass Rate:** 0%

---

## 🚀 NEXT STEPS

After testing:
1. Fix all critical/major bugs
2. Polish UI/UX issues
3. Add missing validations
4. Optimize performance
5. Deploy to production
6. User acceptance testing

---

## 📝 NOTES

- MongoDB connection warnings can be ignored in dev
- File uploads stored in uploads/ directory (ephemeral on Render)
- Rich text content saved as HTML
- All dates in ISO format
- Vietnamese language throughout UI

---

**Test Date:** November 10, 2025
**Tester:** AI Assistant
**Environment:** Local Development (Windows)
**Backend:** Node.js + Express + MongoDB
**Frontend:** React 18 + Material-UI v5
