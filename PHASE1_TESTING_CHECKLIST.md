# ✅ PHASE 1 - MANUAL TESTING CHECKLIST

## 🎯 Testing Environment
- ✅ Backend: Running on http://localhost:5000
- ✅ Frontend: Running on http://localhost:3000  
- ✅ MongoDB: Connected
- ✅ All routes registered
- ✅ No compilation errors

---

## 📋 PRE-TESTING SETUP

### Step 1: Access Application
1. Open browser: `http://localhost:3000`
2. Verify login page loads
3. No console errors

### Step 2: Login Accounts
**Teacher Account:**
```
Email: teacher@dau.edu.vn
Password: teacher123
```

**Student Account:**
```
Email: student@dau.edu.vn
Password: student123
```

### Step 3: Select Test Course
- Pick any existing course
- Note the course ID for testing

---

## 🧪 FEATURE 1: COURSE SETTINGS & SYLLABUS

### ✅ Test 1.1: Access Settings Page
**As:** Teacher  
**Steps:**
1. Login as teacher
2. Go to Courses
3. Click on a course
4. Click "Cài đặt khóa học" button

**Expected:**
- [ ] CourseSettings page loads
- [ ] 4 tabs visible
- [ ] Current data populated
- [ ] No errors

**Status:** ⬜ Not tested | ✅ Pass | ❌ Fail

---

### ✅ Test 1.2: Update General Settings
**As:** Teacher  
**Steps:**
1. In "Thông tin chung" tab
2. Change course format → "Theo tuần"
3. Set start date → 2025-01-15
4. Set end date → 2025-05-30
5. Add objective → "Test objective 1"
6. Click "Lưu thay đổi"

**Expected:**
- [ ] Success message appears
- [ ] Redirects to course page
- [ ] Settings saved (reload to verify)

**Status:** ⬜ Not tested | ✅ Pass | ❌ Fail

---

### ✅ Test 1.3: Rich Text Syllabus
**As:** Teacher  
**Steps:**
1. Switch to "Đề cương (Syllabus)" tab
2. Use toolbar to add:
   - Headers (H1, H2)
   - Bold/italic text
   - Bullet list
   - Link
3. Save

**Expected:**
- [ ] Toolbar works
- [ ] Text formatting applied
- [ ] HTML saved correctly
- [ ] Displays properly after reload

**Status:** ⬜ Not tested | ✅ Pass | ❌ Fail

---

### ✅ Test 1.4: Grading Weights
**As:** Teacher  
**Steps:**
1. Switch to "Thang điểm" tab
2. Set weights:
   - Assignments: 40%
   - Quizzes: 30%
   - Midterm: 15%
   - Final: 15%
3. Verify total = 100% (green chip)
4. Save

**Expected:**
- [ ] Total chip shows 100% in green
- [ ] No warning alerts
- [ ] Weights saved

**Status:** ⬜ Not tested | ✅ Pass | ❌ Fail

---

### ✅ Test 1.5: Invalid Weights Warning
**As:** Teacher  
**Steps:**
1. Set weights totaling 95%
2. Check alert

**Expected:**
- [ ] Warning: "Tổng tỷ trọng phải bằng 100%"
- [ ] Red chip showing 95%
- [ ] Can still save (warning only)

**Status:** ⬜ Not tested | ✅ Pass | ❌ Fail

---

### ✅ Test 1.6: Access Settings
**As:** Teacher  
**Steps:**
1. Switch to "Truy cập" tab
2. Set visibility → "Riêng tư"
3. Set enrollment key → "TEST2025"
4. Enable guest access
5. Save

**Expected:**
- [ ] All settings saved
- [ ] Course visibility changed

**Status:** ⬜ Not tested | ✅ Pass | ❌ Fail

---

## 🧪 FEATURE 2: ASSIGNMENT SUBMISSION

### ✅ Test 2.1: Create Assignment
**As:** Teacher  
**Steps:**
1. Go to Assignments
2. Click "Tạo bài tập mới"
3. Fill form:
   - Title: "Test Assignment 1"
   - Description: "Submit your work"
   - Max grade: 100
   - Due date: 7 days from now
4. Submit

**Expected:**
- [ ] Assignment created
- [ ] Appears in list
- [ ] Due date correct

**Status:** ⬜ Not tested | ✅ Pass | ❌ Fail

---

### ✅ Test 2.2: Submit Assignment (Student)
**As:** Student  
**Steps:**
1. Login as student
2. Go to assignment
3. Click "Nộp bài tập"
4. Enter content: "This is my submission"
5. Upload 3 files (PDF, Image, Text)
6. Submit

**Expected:**
- [ ] Files accepted (< 50MB each)
- [ ] Success message
- [ ] Files list shows with sizes
- [ ] Submission date recorded

**Status:** ⬜ Not tested | ✅ Pass | ❌ Fail

---

### ✅ Test 2.3: File Upload Limits
**As:** Student  
**Steps:**
1. Try upload > 50MB file
2. Try upload 11 files
3. Try .exe file

**Expected:**
- [ ] Error: File too large
- [ ] Error: Max 10 files
- [ ] Error: Unsupported type

**Status:** ⬜ Not tested | ✅ Pass | ❌ Fail

---

### ✅ Test 2.4: Resubmit Assignment
**As:** Student  
**Steps:**
1. Return to assignment
2. Click "Nộp lại"
3. Change content
4. Add 1 more file
5. Submit

**Expected:**
- [ ] Attempt number increases
- [ ] Previous submission in history
- [ ] New submission replaces current

**Status:** ⬜ Not tested | ✅ Pass | ❌ Fail

---

### ✅ Test 2.5: Grade Assignment
**As:** Teacher  
**Steps:**
1. Go to assignment
2. Click "Xem tất cả bài nộp"
3. Click grade button
4. Enter grade: 85
5. Enter feedback: "Good work!"
6. Submit

**Expected:**
- [ ] Grade saved
- [ ] Feedback visible
- [ ] Statistics updated
- [ ] **CHECK: Gradebook entry created**

**Status:** ⬜ Not tested | ✅ Pass | ❌ Fail

---

### ✅ Test 2.6: View Graded Submission
**As:** Student  
**Steps:**
1. Go to assignment
2. View submission

**Expected:**
- [ ] Status: "Đã chấm"
- [ ] Grade: 85/100 shown
- [ ] Feedback visible
- [ ] Files downloadable

**Status:** ⬜ Not tested | ✅ Pass | ❌ Fail

---

### ✅ Test 2.7: Late Submission
**As:** Teacher/Student  
**Steps:**
1. Create assignment with due date = yesterday
2. Student submits today

**Expected:**
- [ ] Late warning shown
- [ ] "Nộp trễ" badge visible
- [ ] Still accepts submission

**Status:** ⬜ Not tested | ✅ Pass | ❌ Fail

---

### ✅ Test 2.8: Statistics Display
**As:** Teacher  
**Steps:**
1. View submissions list
2. Check statistics cards

**Expected:**
- [ ] Total students count
- [ ] Submitted count
- [ ] Graded count
- [ ] Average grade
- [ ] Pie chart displays

**Status:** ⬜ Not tested | ✅ Pass | ❌ Fail

---

## 🧪 FEATURE 3: QUIZ SYSTEM

### ✅ Test 3.1: Create Quiz
**As:** Teacher  
**Steps:**
1. Go to course → Quizzes
2. Click "Tạo Quiz mới"
3. Fill:
   - Title: "Test Quiz 1"
   - Time: 30 minutes
   - Max attempts: 2
   - Passing: 70%
4. Add questions:
   - 1 MCQ
   - 1 True/False
   - 1 Short Answer
   - 1 Essay
5. Publish

**Expected:**
- [ ] All question types saved
- [ ] Total points calculated
- [ ] Status = published
- [ ] Visible to students

**Status:** ⬜ Not tested | ✅ Pass | ❌ Fail

---

### ✅ Test 3.2: Validation Tests
**As:** Teacher  
**Steps:**
1. Try publish without title
2. Try publish without questions
3. Try MCQ without correct answer

**Expected:**
- [ ] Error: "Vui lòng nhập tiêu đề"
- [ ] Error: "Thêm ít nhất 1 câu hỏi"
- [ ] Error: "Đánh dấu đáp án đúng"

**Status:** ⬜ Not tested | ✅ Pass | ❌ Fail

---

### ✅ Test 3.3: Take Quiz (Student)
**As:** Student  
**Steps:**
1. Go to Quizzes
2. Click "Bắt đầu"
3. Verify timer starts
4. Answer all questions
5. Navigate between questions
6. Submit

**Expected:**
- [ ] Timer counts down
- [ ] Progress bar updates
- [ ] Question chips show status
- [ ] Confirmation dialog
- [ ] Submit successful

**Status:** ⬜ Not tested | ✅ Pass | ❌ Fail

---

### ✅ Test 3.4: Auto-Grading Results
**As:** Student  
**Steps:**
1. View results after submit
2. Check scores

**Expected:**
- [ ] MCQ auto-graded (correct/wrong)
- [ ] True/False auto-graded
- [ ] Short answer auto-graded
- [ ] Essay: "Đang chờ chấm"
- [ ] Partial score shown
- [ ] Pass/Fail status

**Status:** ⬜ Not tested | ✅ Pass | ❌ Fail

---

### ✅ Test 3.5: Manual Grade Essay
**As:** Teacher  
**Steps:**
1. Go to quiz → "Xem bài làm"
2. Find student attempt
3. Grade essay question
4. Enter points: 4/5
5. Add feedback
6. Submit

**Expected:**
- [ ] Essay graded
- [ ] Total score updated
- [ ] Pass/Fail recalculated
- [ ] **CHECK: Gradebook entry created**
- [ ] Feedback visible to student

**Status:** ⬜ Not tested | ✅ Pass | ❌ Fail

---

### ✅ Test 3.6: Retake Quiz
**As:** Student  
**Steps:**
1. Return to quiz
2. Click "Làm lại"
3. Answer correctly
4. Submit

**Expected:**
- [ ] Attempt #2 started
- [ ] New score recorded
- [ ] Best score tracked
- [ ] Both attempts viewable

**Status:** ⬜ Not tested | ✅ Pass | ❌ Fail

---

### ✅ Test 3.7: Max Attempts Limit
**As:** Student  
**Steps:**
1. Try 3rd attempt (max = 2)

**Expected:**
- [ ] Error: "Đã hết lượt làm bài"
- [ ] Can only view results

**Status:** ⬜ Not tested | ✅ Pass | ❌ Fail

---

### ✅ Test 3.8: Auto-Submit Timeout
**As:** Teacher/Student  
**Steps:**
1. Create quiz with 2 min limit
2. Student starts quiz
3. Wait for timer = 0

**Expected:**
- [ ] Auto-submits at 0:00
- [ ] Message: "Hết giờ! Nộp tự động"
- [ ] Answered questions saved

**Status:** ⬜ Not tested | ✅ Pass | ❌ Fail

---

### ✅ Test 3.9: Question Shuffling
**As:** Teacher  
**Steps:**
1. Enable shuffle options
2. 2 students take quiz
3. Compare question order

**Expected:**
- [ ] Questions in different order
- [ ] Options in different order
- [ ] Correct answers still work

**Status:** ⬜ Not tested | ✅ Pass | ❌ Fail

---

## 🧪 FEATURE 4: GRADEBOOK

### ✅ Test 4.1: View Gradebook (Teacher)
**As:** Teacher  
**Steps:**
1. Go to course
2. Click "Bảng điểm"
3. View table

**Expected:**
- [ ] All students listed
- [ ] Columns: Name, Email, Items, Total, Letter
- [ ] Grade items counted
- [ ] Total % calculated
- [ ] Letter grades (A-F)
- [ ] Pass/Fail status

**Status:** ⬜ Not tested | ✅ Pass | ❌ Fail

---

### ✅ Test 4.2: Assignment Integration
**As:** Student/Teacher  
**Steps:**
1. Teacher grades assignment (85/100)
2. Student checks gradebook

**Expected:**
- [ ] Grade item appears
- [ ] Type = "assignment"
- [ ] Score = 85/100
- [ ] Weight applied
- [ ] Counted in total

**Status:** ⬜ Not tested | ✅ Pass | ❌ Fail

---

### ✅ Test 4.3: Quiz Integration
**As:** Student/Teacher  
**Steps:**
1. Student completes quiz (70%)
2. Teacher grades essay
3. Student checks gradebook

**Expected:**
- [ ] Grade item appears
- [ ] Type = "quiz"
- [ ] Score updated after essay grade
- [ ] Weight applied
- [ ] Counted in total

**Status:** ⬜ Not tested | ✅ Pass | ❌ Fail

---

### ✅ Test 4.4: Weighted Calculation
**As:** Teacher  
**Steps:**
1. Verify course weights:
   - Assignments: 40%
   - Quizzes: 30%
2. Student has:
   - Assignment: 85/100
   - Quiz: 70/100
3. Check total

**Expected:**
- [ ] Assignment: 85 × 0.4 = 34
- [ ] Quiz: 70 × 0.3 = 21
- [ ] Total: 55%
- [ ] Letter grade correct
- [ ] Pass/Fail based on threshold

**Status:** ⬜ Not tested | ✅ Pass | ❌ Fail

---

### ✅ Test 4.5: Student View
**As:** Student  
**Steps:**
1. Go to course
2. Click "Điểm của tôi"
3. View grades

**Expected:**
- [ ] Overview card with total %
- [ ] Letter grade shown
- [ ] Pass/Fail status
- [ ] Grade items table
- [ ] Bar chart displays
- [ ] Trend line (if multiple items)

**Status:** ⬜ Not tested | ✅ Pass | ❌ Fail

---

### ✅ Test 4.6: Filter and Sort
**As:** Teacher  
**Steps:**
1. In gradebook:
2. Filter by status: "Đạt"
3. Sort by total (descending)
4. Search student name

**Expected:**
- [ ] Filter works
- [ ] Sort works
- [ ] Search works
- [ ] Results count updates

**Status:** ⬜ Not tested | ✅ Pass | ❌ Fail

---

### ✅ Test 4.7: Export CSV
**As:** Teacher  
**Steps:**
1. Click "Xuất CSV"
2. Open file

**Expected:**
- [ ] File downloads
- [ ] Name: gradebook_[code]_[date].csv
- [ ] Contains student data
- [ ] UTF-8 encoded
- [ ] Opens in Excel

**Status:** ⬜ Not tested | ✅ Pass | ❌ Fail

---

### ✅ Test 4.8: Statistics
**As:** Teacher  
**Steps:**
1. View gradebook stats

**Expected:**
- [ ] Average grade
- [ ] Highest/lowest
- [ ] Pass rate %
- [ ] Distribution chart

**Status:** ⬜ Not tested | ✅ Pass | ❌ Fail

---

## 🧪 INTEGRATION TESTING

### ✅ Test 5.1: Complete Student Journey
**As:** Student  
**Steps:**
1. Enroll in course
2. View syllabus
3. Submit assignment → graded
4. Take quiz → auto-graded + manual essay
5. Check gradebook for both
6. Verify total weighted score

**Expected:**
- [ ] All features work together
- [ ] Gradebook shows both grades
- [ ] Weighted total correct
- [ ] No errors throughout

**Status:** ⬜ Not tested | ✅ Pass | ❌ Fail

---

### ✅ Test 5.2: Complete Teacher Journey
**As:** Teacher  
**Steps:**
1. Update course settings
2. Create assignment
3. Create quiz
4. Grade submissions
5. Grade essay questions
6. View gradebook
7. Export CSV
8. Review statistics

**Expected:**
- [ ] All teacher features work
- [ ] No permission errors
- [ ] Data consistent
- [ ] Reports accurate

**Status:** ⬜ Not tested | ✅ Pass | ❌ Fail

---

## 📊 TEST RESULTS

### Summary
- **Total Tests:** 43
- **Passed:** ___
- **Failed:** ___
- **Blocked:** ___
- **Pass Rate:** ___%

### Critical Issues Found
1. _______________
2. _______________
3. _______________

### Minor Issues Found
1. _______________
2. _______________
3. _______________

### UI/UX Improvements
1. _______________
2. _______________
3. _______________

---

## ✅ TESTING COMPLETE

**Date:** November 10, 2025  
**Tester:** _______________  
**Time Spent:** ___ hours  
**Overall Status:** ⬜ PASS | ⬜ FAIL | ⬜ BLOCKED

**Recommendation:**
- [ ] Ready for production
- [ ] Needs bug fixes
- [ ] Needs UI polish
- [ ] Needs more testing

**Next Steps:**
1. _______________
2. _______________
3. _______________

---

## 🎯 CONCLUSION

Phase 1 includes 4 major features:
1. ✅ Course Settings & Syllabus
2. ✅ Assignment Submission System
3. ✅ Quiz Builder & Auto-Grading
4. ✅ Gradebook with Integration

All features are **implemented and deployed**.  
Ready for **comprehensive manual testing**.

**Live URLs:**
- Backend: http://localhost:5000
- Frontend: http://localhost:3000
- GitHub: https://github.com/haihoandaotao/lmsdau
