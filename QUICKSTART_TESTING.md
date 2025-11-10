# 🚀 PHASE 1 - QUICK START TESTING

## ⚡ 5-MINUTE SETUP

### 1. Servers Running ✅
- **Backend:** http://localhost:5000 (MongoDB Atlas connected)
- **Frontend:** http://localhost:3000

### 2. Test Accounts ✅
```
Teacher: teacher@dau.edu.vn / teacher123
Student: student@dau.edu.vn / student123
```

### 3. Test Course ✅
- **Name:** Test Course for Phase 1
- **Code:** TEST101
- **ID:** 691151290d741b545d69551a

---

## 🎯 FASTEST TEST PATH (20 min)

### Step 1: Login (1 min)
1. Go to http://localhost:3000
2. Login as **teacher@dau.edu.vn** / **teacher123**

### Step 2: Course Settings (3 min)
1. Click course → **"Cài đặt khóa học"**
2. Tab "Đề cương": Add rich text content, save
3. Tab "Thang điểm": Set weights (40/30/15/15), save

### Step 3: Create Assignment (2 min)
1. Menu "Bài tập" → "Tạo bài tập mới"
2. Title: "Test 1", Due: 7 days, Grade: 100, Submit

### Step 4: Student Submits (3 min)
1. Logout, login as **student@dau.edu.vn** / **student123**
2. Go to assignment → "Nộp bài tập"
3. Add content + upload 1 file, submit

### Step 5: Teacher Grades (2 min)
1. Logout, login as **teacher**
2. Assignment → "Xem bài nộp" → Grade: 85, Feedback: "Good", Submit

### Step 6: Create Quiz (5 min)
1. Quizzes → "Tạo Quiz"
2. Add 2 questions (MCQ + Essay), Publish

### Step 7: Student Takes Quiz (2 min)
1. Login as **student**
2. Take quiz, answer all, submit

### Step 8: Check Gradebook (2 min)
1. Login as **teacher**
2. "Bảng điểm" → Verify assignment + quiz grades
3. "Xuất CSV" to test export

---

## ✅ SUCCESS CRITERIA

If all 8 steps work without errors:
- ✅ **Phase 1 is PRODUCTION READY**
- ✅ Deploy to Render.com
- ✅ Move to Phase 2

---

## 📋 DETAILED CHECKLIST

See: **PHASE1_TESTING_CHECKLIST.md** (43 test cases)

---

## 🐛 FOUND BUGS?

Document in: **PHASE1_TESTING_REPORT.md** → Critical Issues section

---

## 🎉 READY TO TEST!

Open browser: http://localhost:3000
Login: teacher@dau.edu.vn / teacher123
