# 🎓 Sequential Learning System - Complete Guide

## 📋 Overview

Hệ thống học tuần tự đã được triển khai - students phải **hoàn thành bài kiểm tra nhanh (đạt 80%)** sau mỗi bài học mới được xem bài tiếp theo.

---

## ✨ New Features Implemented

### 1. 🔒 **Sequential Learning (Học Tuần Tự)**

**Cách hoạt động:**
- Bài học đầu tiên luôn mở khóa
- Các bài tiếp theo bị **khóa** (🔒) cho đến khi:
  - Hoàn thành video trước đó
  - Pass bài kiểm tra nhanh (≥ 80%)

**Visual Indicators:**
- ✅ **CheckCircle icon (xanh)** - Bài đã hoàn thành
- 🔒 **Lock icon (xám)** - Bài bị khóa
- ▶️ **Play icon** - Bài đang có thể xem

**User Experience:**
```
Video 1: Welcome (Unlocked) → Watch → Take Quiz → Pass (85%) ✅
   ↓
Video 2: HTML Basics (Now Unlocked) → Watch → Take Quiz → Fail (60%) ❌
   ↓
Video 3: HTML Forms (Still Locked 🔒) ← Cannot access yet
```

---

### 2. 📝 **Quick Quiz Component**

**Features:**
- **3 questions** mỗi bài học
- **Multiple choice** format
- **Progress bar** hiển thị tiến độ
- **Navigation**: Câu trước/tiếp, Nộp bài
- **Instant feedback** sau khi nộp
- **Retry option** nếu fail

**Quiz UI:**
```
┌─────────────────────────────────────┐
│ 📝 Kiểm Tra Nhanh         1/3      │
│ ████████░░░░░░░░░░░░░░░░░ 33%      │
├─────────────────────────────────────┤
│ ℹ️ Bạn cần đạt tối thiểu 80%       │
├─────────────────────────────────────┤
│ Câu 1: Bạn đã hiểu nội dung...?    │
│                                     │
│ ○ Đã hiểu hoàn toàn               │
│ ○ Hiểu một phần                   │
│ ○ Chưa hiểu                       │
│ ○ Cần xem lại                     │
├─────────────────────────────────────┤
│ [← Câu Trước]    [Câu Tiếp →]     │
└─────────────────────────────────────┘
```

**After Submit:**
- **Pass (≥80%)**: 🎉 Success screen → "Tiếp Tục Học" button
- **Fail (<80%)**: ❌ Fail screen → "Làm Lại" button
- **Detailed Results**: Show correct/wrong answers với explanations

---

### 3. 🏫 **Logo & UI Improvements**

**Changes:**
1. **Logo trường** (ĐAU) thêm bên trái "LMS-DAU" trong sidebar
   - White background box
   - Purple text
   - Rounded corners với shadow
   
2. **Dark Mode Toggle** di chuyển từ account menu lên **top bar**
   - Bên cạnh notification icon
   - Moon emoji icon (🌙)
   - Tooltip: "Chế độ ban ngày/đêm"

**Before vs After:**
```
BEFORE:
┌─────────────────────────┐
│ LMS-DAU                │  Sidebar
└─────────────────────────┘
┌─────────────────────────┐
│ [Menu] [Notifications] 🔔 [Avatar 👤] │  Top Bar
│                          ↓ Click      │
│                   [Profile]           │
│                   [Dark Mode Toggle]  │ ❌ Here
│                   [Logout]            │
└─────────────────────────────────────┘

AFTER:
┌─────────────────────────┐
│ [ĐAU] LMS-DAU          │  Sidebar ← Logo added
└─────────────────────────┘
┌─────────────────────────────────────┐
│ [Menu] [🌙] [🔔] [👤] │  Top Bar
│         ↑                           │ ✅ Moved here
└─────────────────────────────────────┘
```

---

## 🗄️ Database Schema

### New Collection: **itemcompletions**

```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  item: ObjectId,
  module: ObjectId (ref: Module),
  course: ObjectId (ref: Course),
  completed: Boolean,           // true if passed quiz
  quizScore: Number,            // 0-100
  quizAttempts: Number,         // count of attempts
  completedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `{ user: 1, item: 1 }` - Fast lookup for completion status
- `{ user: 1, course: 1 }` - Fast course progress queries

---

## 🔌 Backend APIs

### 1. Complete Item (After Quiz)
```http
POST /api/item-completion/complete
Authorization: Bearer <token>

Body:
{
  "itemId": "video_item_id",
  "moduleId": "module_id", 
  "courseId": "course_id",
  "quizScore": 85
}

Response:
{
  "success": true,
  "data": {
    "_id": "...",
    "user": "...",
    "item": "...",
    "completed": true,
    "quizScore": 85,
    "quizAttempts": 1
  }
}
```

### 2. Check Unlock Status
```http
GET /api/item-completion/check-unlock/:moduleId/:itemId
Authorization: Bearer <token>

Response (Unlocked):
{
  "success": true,
  "data": { "isUnlocked": true }
}

Response (Locked):
{
  "success": true,
  "data": { 
    "isUnlocked": false,
    "message": "Bạn cần hoàn thành 'HTML Basics' trước"
  }
}
```

### 3. Get Course Completions
```http
GET /api/item-completion/course/:courseId
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "item": "item1_id",
      "completed": true,
      "quizScore": 100
    },
    {
      "_id": "...",
      "item": "item2_id", 
      "completed": false,
      "quizScore": 60
    }
  ]
}
```

---

## 💻 Frontend Components

### QuickQuiz Component

**Location:** `frontend/src/components/QuickQuiz.js`

**Props:**
```javascript
<QuickQuiz
  questions={[
    {
      question: "Question text?",
      options: ["A", "B", "C", "D"],
      correctAnswer: "A",
      explanation: "Why A is correct"
    }
  ]}
  onPass={(score) => { /* Save completion */ }}
  itemId="video_item_id"
/>
```

**States:**
- `currentQuestion` - Current question index
- `answers` - User answers object
- `showResults` - Toggle results screen
- `score` - Final percentage

**Key Functions:**
- `handleAnswerChange()` - Save user answer
- `handleSubmit()` - Calculate score, show results
- `handleRetry()` - Reset quiz

---

## 🎯 How It Works (Flow)

### Student Journey:

1. **Enter Course** → IT101 loaded
   ```
   ✅ Video 1: Welcome (Unlocked)
   🔒 Video 2: HTML Basics (Locked)
   🔒 Video 3: Forms (Locked)
   ```

2. **Click Video 1** → Watch video
   - Video plays normally
   - Bookmarks/notes work
   - After watching, see:
   
   ```
   ┌─────────────────────────────────┐
   │ 📝 Kiểm Tra Nhanh              │
   │ Hoàn thành bài kiểm tra nhanh  │
   │ để mở khóa bài học tiếp theo.  │
   │                                 │
   │ [Làm Bài Kiểm Tra]             │
   └─────────────────────────────────┘
   ```

3. **Click "Làm Bài Kiểm Tra"** → Quiz appears
   - Answer 3 questions
   - Click "Nộp Bài"

4. **Quiz Results:**
   
   **If Pass (≥80%):**
   ```
   ✅ Xuất Sắc!
   Bạn đã đạt 100%
   Bạn đã hoàn thành bài kiểm tra.
   Bài học tiếp theo đã được mở khóa!
   
   [Tiếp Tục Học]
   ```
   
   **If Fail (<80%):**
   ```
   ❌ Chưa Đạt
   Bạn đạt 66% (Cần 80% để qua)
   Hãy xem lại bài học và thử lại nhé!
   
   [Làm Lại]
   ```

5. **After Pass** → Video 2 unlocks
   ```
   ✅ Video 1: Welcome (Completed - 100%)
   ✅ Video 2: HTML Basics (Now Unlocked!)
   🔒 Video 3: Forms (Still Locked)
   ```

6. **Try to click locked video** → Alert
   ```
   "Bạn cần hoàn thành 'HTML Basics' trước khi xem bài này!"
   ```

---

## 🎨 UI/UX Details

### Sidebar Item States:

**Completed:**
```
✅ HTML Basics ✓
```
- Green checkmark icon
- Checkmark after title
- Normal opacity
- Clickable

**Current (Unlocked):**
```
▶️ HTML Forms
```
- Play icon
- Normal opacity
- Highlighted background if active
- Clickable

**Locked:**
```
🔒 JavaScript Basics
   Chưa mở khóa
```
- Lock icon
- Gray/reduced opacity (0.5)
- "Chưa mở khóa" secondary text
- Not clickable (disabled)

---

## 🧪 Testing Guide

### Test Scenario 1: Happy Path

1. Login as student
2. Go to IT101 course
3. Verify sidebar shows:
   - Video 1: Unlocked ✅
   - Video 2: Locked 🔒
4. Click Video 1 → Watch
5. Click "Làm Bài Kiểm Tra"
6. Answer all questions correctly
7. Click "Nộp Bài"
8. Verify: Success screen shows
9. Click "Tiếp Tục Học"
10. Verify: Video 2 now unlocked ✅

### Test Scenario 2: Fail Quiz

1. Same as above until step 6
2. Answer questions incorrectly (get < 80%)
3. Click "Nộp Bài"
4. Verify: Fail screen shows score
5. Click "Làm Lại"
6. Verify: Quiz resets
7. Answer correctly this time
8. Pass and unlock next video

### Test Scenario 3: Try to Skip

1. Login as student
2. Go to IT101
3. Try to click Video 2 (locked)
4. Verify: Alert appears
   ```
   "Bạn cần hoàn thành 'Welcome to Web Development' trước khi xem bài này!"
   ```
5. Verify: Video 2 doesn't load

### Test Scenario 4: UI Elements

1. Check sidebar: Logo "ĐAU" visible
2. Check top bar: Dark mode toggle (🌙) visible
3. Click avatar → Dark mode NOT in menu
4. Verify: No overlap with avatar menu

---

## 📊 Database Queries

### Check completion status:
```javascript
// Get all completions for a user in a course
ItemCompletion.find({
  user: userId,
  course: courseId
});

// Check if specific item completed
ItemCompletion.findOne({
  user: userId,
  item: itemId,
  completed: true
});
```

### Create/Update completion:
```javascript
// After quiz pass
ItemCompletion.create({
  user: userId,
  item: itemId,
  module: moduleId,
  course: courseId,
  completed: true,
  quizScore: 85,
  quizAttempts: 1,
  completedAt: new Date()
});
```

---

## 🚀 Future Enhancements

### 1. **Better Quiz Questions**
Currently: Generic 3 questions for all videos
Todo: Create specific questions per video content

Example for "HTML Basics":
```javascript
{
  question: "Thẻ HTML nào dùng để tạo heading lớn nhất?",
  options: ["<h1>", "<h6>", "<header>", "<title>"],
  correctAnswer: "<h1>",
  explanation: "<h1> là heading level 1, lớn nhất"
}
```

### 2. **Question Bank**
- Store questions in database
- Module model with `quizQuestions` field
- Randomize questions for each attempt

### 3. **Time Tracking**
- Track time spent on each video
- Minimum watch time before quiz unlocks
- "You must watch at least 80% of the video"

### 4. **Certificates**
- After completing all videos in course
- Generate PDF certificate
- Show completion stats

### 5. **Leaderboard**
- Track quiz scores across users
- Show top performers
- Motivate competition

---

## 📁 Files Changed

### Backend (3 files):
- ✅ `models/ItemCompletion.js` - NEW
- ✅ `routes/itemCompletion.js` - NEW
- ✅ `server.js` - Added route

### Frontend (3 files):
- ✅ `components/QuickQuiz.js` - NEW (340 lines)
- ✅ `pages/CourseViewer.js` - Updated (added quiz integration)
- ✅ `components/Layout.js` - Updated (logo + dark mode)

---

## 🎓 Key Achievements

✅ **Sequential Learning**: Students can't skip ahead
✅ **Quiz Validation**: 80% threshold to pass
✅ **Visual Feedback**: Clear locked/unlocked states
✅ **Retry Mechanism**: Students can retake failed quizzes
✅ **Progress Tracking**: Database tracks all attempts
✅ **Better UX**: Logo added, dark mode moved
✅ **Scalable**: Easy to add more questions per video

---

## 💡 Usage Tips

### For Students:
1. Watch videos carefully before taking quiz
2. Use bookmarks/notes features
3. Review content if you fail quiz
4. Progress unlocks as you complete quizzes

### For Teachers:
1. Monitor completion rates in gradebook
2. See quiz attempt counts
3. Adjust content if many students fail
4. Create better quiz questions

### For Admins:
1. Check ItemCompletion collection for stats
2. Monitor sequential progression
3. Export completion data
4. Identify struggling students

---

## 🐛 Known Limitations

1. **Generic Questions**: Current questions are same for all videos
2. **No Time Limit**: Students can take unlimited time on quiz
3. **No Question Pool**: Same 3 questions every attempt
4. **Manual Questions**: Need to add questions in code
5. **No Analytics**: No detailed quiz analytics dashboard

---

## 🔗 Related Documentation

- `COURSERA_FEATURES_GUIDE.md` - Video player features
- `LIVE_TESTING_SESSION.md` - Phase 1 testing guide
- Backend API docs in each route file

---

**Created**: November 10, 2025
**Version**: 1.0.0
**Status**: ✅ Production Ready

**Test URL**: http://localhost:3000/courses/[courseId]/learn
