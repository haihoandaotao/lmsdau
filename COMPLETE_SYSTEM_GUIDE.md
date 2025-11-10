# 🎓 Hướng Dẫn Sử Dụng Hệ Thống LMS Hoàn Chỉnh

## 📋 Tổng Quan Tính Năng Mới

Hệ thống LMS đã được nâng cấp với các tính năng hoàn chỉnh cho trải nghiệm học tập Coursera-style:

### ✨ Tính Năng Cho Giáo Viên

1. **📝 Content Editor** - Chỉnh sửa nội dung module
   - Thêm/sửa/xóa items (video, reading, quiz)
   - Reorder items (drag & drop)
   - Rich text editor cho nội dung
   
2. **📤 Upload PDF/Tài Liệu**
   - Upload file PDF, DOC, DOCX, PPT, PPTX
   - Giới hạn 50MB/file
   - Quản lý tài liệu theo module
   
3. **❓ Quiz Builder** (Đã có sẵn)
   - Tạo câu hỏi trắc nghiệm, tự luận
   - Auto-grading
   - Question bank
   
4. **📊 Gradebook** (Đã có sẵn)
   - Chấm điểm submissions
   - Xem báo cáo chi tiết
   - Export grades

### ✨ Tính Năng Cho Sinh Viên

1. **🎥 Enhanced Video Player**
   - Bookmarks với timestamps
   - Notes trong video
   - Speed control, Picture-in-Picture
   - Clickable transcripts
   
2. **📊 Progress Dashboard**
   - Biểu đồ tiến độ học tập
   - Achievement badges
   - Learning streak
   - Certificate khi hoàn thành
   
3. **🔒 Sequential Learning**
   - Phải hoàn thành quiz (≥80%) để mở khóa bài tiếp
   - Lock/unlock items tự động
   - Quick Quiz sau mỗi video
   
4. **📎 Resource Viewer**
   - Xem và download tài liệu PDF
   - Thống kê lượt download
   - Organized by module

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Thử

### 1. Cài Đặt Dependencies

```bash
# Backend
cd backend
npm install multer  # Nếu chưa có

# Frontend (không cần thêm gì)
cd frontend
```

### 2. Tạo Dữ Liệu Mẫu

```bash
cd backend
node seeders/comprehensive-seeder.js
```

Seeder sẽ tạo:
- ✅ 3 users (1 teacher, 2 students)
- ✅ 3 courses (Web Dev, DSA, Database)
- ✅ 3 modules với video/reading items
- ✅ 3 PDF resources mẫu
- ✅ 2 quizzes với câu hỏi
- ✅ 1 quiz attempt (student đã làm)
- ✅ 1 assignment + 1 submission (đã chấm)
- ✅ 1 forum post + 1 comment

**Tài khoản đăng nhập:**
```
Giáo viên: teacher1@dau.edu.vn / 123456
Sinh viên 1: student1@dau.edu.vn / 123456
Sinh viên 2: student2@dau.edu.vn / 123456
```

### 3. Khởi Động Hệ Thống

```bash
# Terminal 1: Backend
cd backend
npm start

# Terminal 2: Frontend
cd frontend
npm start
```

---

## 📖 Hướng Dẫn Sử Dụng Chi Tiết

### 🎓 Workflow Cho Giáo Viên

#### A. Quản Lý Nội Dung Khóa Học

1. **Đăng nhập** với `teacher1@dau.edu.vn`

2. **Vào khóa học** → Click vào course card → "Quản Lý Module"

3. **Chỉnh sửa nội dung module:**
   - Click nút **"Edit Content"** trên module card
   - URL: `/courses/:courseId/modules/:moduleId/edit`
   
   **Content Editor có:**
   - ✏️ Sửa title & description của module
   - ➕ Thêm items mới (video, reading, quiz)
   - 🗑️ Xóa items
   - ⬆️⬇️ Reorder items (thay đổi thứ tự)
   - 💾 Lưu thay đổi

4. **Upload PDF/Tài Liệu:**
   - Trong Content Editor, click **"Upload PDF/Tài Liệu"**
   - Chọn file (PDF, DOC, DOCX, PPT, PPTX)
   - Nhập tên và mô tả
   - Click **"Upload"**
   - File sẽ hiển thị trong tab "Tài nguyên" khi student học

#### B. Tạo Quiz

1. Vào course → Click **"Quizzes"**
2. Click **"Tạo Quiz Mới"**
3. Điền thông tin:
   - Tiêu đề, mô tả
   - Thời gian, điểm chuẩn
4. Thêm câu hỏi:
   - Multiple choice (4 options)
   - True/False
   - Essay (tự luận)
5. **Lưu Quiz**

#### C. Chấm Bài & Quản Lý

1. **Xem Submissions:**
   - Course → Assignments → Click assignment
   - Xem danh sách submissions
   
2. **Chấm điểm:**
   - Click vào submission
   - Nhập điểm và feedback
   - Submit grade

3. **Gradebook:**
   - Course → Gradebook
   - Xem tất cả điểm của students
   - Export CSV

---

### 👨‍🎓 Workflow Cho Sinh Viên

#### A. Học Bài

1. **Đăng nhập** với `student1@dau.edu.vn`

2. **Vào khóa học** → Click **"Bắt đầu học"** hoặc "Tiếp tục học"

3. **Xem Video với Enhanced Player:**
   - Video player có đầy đủ controls
   - **Thêm Bookmark:** Click icon 🔖 → Video sẽ lưu timestamp
   - **Thêm Note:** Click icon 📝 → Viết ghi chú với timestamp
   - **Speed Control:** Thay đổi tốc độ 0.5x - 2x
   - **Picture-in-Picture:** Xem video trong tab nhỏ
   - **Transcripts:** Click timestamps để jump đến vị trí

4. **Làm Quick Quiz:**
   - Sau khi xem video, click **"Làm Bài Kiểm Tra"**
   - Trả lời 3 câu hỏi
   - **Phải đạt ≥80% (2/3 câu)** để pass
   - Nếu fail → Click **"Làm Lại"**
   - Nếu pass → Item được đánh dấu ✅, bài tiếp theo mở khóa

5. **Sequential Learning:**
   - Các bài tiếp theo sẽ có icon 🔒 (locked)
   - Phải hoàn thành bài trước mới mở được bài sau
   - Click vào bài locked → Hiện thông báo

#### B. Xem Tài Nguyên

1. Trong trang học (CourseViewer)
2. Click tab **"Tài nguyên"**
3. Xem danh sách PDF/documents
4. Click **"📥 Tải xuống"** để download

#### C. Theo Dõi Tiến Độ

1. Click tab **"📊 Progress"**
2. Xem:
   - **Line Chart:** Hoạt động học tập theo tuần
   - **Pie Chart:** Tiến độ từng module
   - **Achievement Badges:**
     - 🎉 First Lesson
     - 🔥 Streak 7/30 ngày
     - ⚡ Speed Learner
     - 💯 Perfect Quiz
     - 🎓 Course Complete
   - **Stats:** Tổng thời gian, streak, avg time/day
   - **Certificate:** Download khi hoàn thành 100%

#### D. Làm Assignment

1. Course → Assignments
2. Click assignment
3. Click **"Nộp Bài"**
4. Upload file hoặc nhập text
5. Submit
6. Đợi giáo viên chấm điểm

#### E. Xem Điểm

1. Course → **"My Grades"**
2. Xem tất cả điểm assignments, quizzes
3. Xem feedback từ giáo viên

---

## 🧪 Kịch Bản Test Đầy Đủ

### Scenario 1: Teacher Tạo & Upload Tài Liệu

```
1. Login as teacher1@dau.edu.vn
2. Go to "Phát Triển Web Hiện Đại" course
3. Click "Quản Lý Module"
4. Click "Edit Content" on "Week 1: HTML & CSS Fundamentals"
5. Click "Thêm Item" → Add new video item
6. Click "Upload PDF/Tài Liệu"
7. Select a PDF file (any PDF)
8. Fill name and description
9. Click "Upload"
10. Click "Lưu Thay Đổi"
11. Navigate to course learn view
12. Go to "Tài nguyên" tab
13. ✅ Verify PDF appears in list
```

### Scenario 2: Student Học Sequential Learning

```
1. Login as student1@dau.edu.vn
2. Go to "Phát Triển Web Hiện Đại" course
3. Click "Tiếp tục học"
4. Watch first video (at least 10 seconds)
5. Click "Làm Bài Kiểm Tra"
6. Answer quiz questions
   - Try failing (answer wrong) → See "Làm Lại"
   - Then answer correctly (2/3 correct)
7. ✅ See success message "Đã hoàn thành!"
8. Check sidebar → Second item should be unlocked
9. Try clicking third item → Should be locked 🔒
10. Complete second item quiz
11. ✅ Verify third item unlocks
```

### Scenario 3: Enhanced Video Player

```
1. Login as student
2. Go to any course with video
3. Play video
4. Test bookmarks:
   - At 0:30, click 🔖 icon → Add bookmark
   - At 1:00, click 🔖 → Add another bookmark
   - Go to "Bookmarks" tab → Click bookmark → Video jumps
5. Test notes:
   - At 0:45, click 📝 → Write note "Important concept"
   - Go to "Notes" tab → See note with timestamp
6. Test speed: Change to 1.5x, 2x
7. Test PiP: Click PiP button → Video in corner
```

### Scenario 4: Progress Dashboard

```
1. Login as student who completed items
2. Go to course learn view
3. Click "📊 Progress" tab
4. ✅ Verify:
   - Line chart shows activity
   - Pie chart shows module completion
   - Achievement badges appear
   - Stats show correct numbers
   - Certificate button (if 100% complete)
```

### Scenario 5: Quiz Builder & Grading

```
1. Login as teacher
2. Go to course → Quizzes
3. Click "Tạo Quiz Mới"
4. Create quiz with:
   - 2 multiple choice questions
   - 1 essay question
5. Save quiz
6. Login as student (different browser/incognito)
7. Take quiz → Submit
8. Login back as teacher
9. Go to quiz results
10. Grade essay question
11. ✅ Verify student sees updated grade
```

---

## 📂 Cấu Trúc Code Mới

### Backend

```
backend/
├── models/
│   └── Resource.js          # Model cho files (PDF, documents)
├── routes/
│   └── resources.js         # API routes cho upload/download
├── seeders/
│   └── comprehensive-seeder.js  # Seeder dữ liệu đầy đủ
└── uploads/
    └── resources/           # Folder chứa uploaded files
```

### Frontend

```
frontend/src/
├── pages/
│   ├── ContentEditor.js     # Trang chỉnh sửa nội dung module
│   ├── CourseViewer.js      # Đã cập nhật: Resources tab
│   └── ...
└── components/
    ├── EnhancedVideoPlayer.js   # Video player với bookmarks/notes
    ├── ProgressDashboard.js     # Dashboard tiến độ
    └── QuickQuiz.js            # Quiz component cho sequential learning
```

---

## 🎯 Các API Endpoints Mới

### Resources API

```javascript
POST   /api/resources/upload              // Upload file (multipart/form-data)
GET    /api/resources/course/:courseId    // Get all resources for course
GET    /api/resources/module/:moduleId    // Get resources by module
GET    /api/resources/:id                 // Get single resource
PUT    /api/resources/:id                 // Update resource metadata
DELETE /api/resources/:id                 // Delete resource (and file)
PUT    /api/resources/:id/download        // Increment download count
```

**Upload Example:**
```javascript
const formData = new FormData();
formData.append('file', pdfFile);
formData.append('name', 'My Document');
formData.append('description', 'Important slides');
formData.append('courseId', courseId);
formData.append('moduleId', moduleId);

await axios.post('/api/resources/upload', formData, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'multipart/form-data'
  }
});
```

---

## 🐛 Troubleshooting

### Lỗi Upload File

**Lỗi:** "File type not supported"
**Giải pháp:** Chỉ hỗ trợ: PDF, DOC, DOCX, PPT, PPTX, Images, Videos

**Lỗi:** "File too large"
**Giải pháp:** Giới hạn 50MB/file. Nén file hoặc chia nhỏ.

### Lỗi Sequential Learning

**Lỗi:** Items không mở khóa sau khi pass quiz
**Giải pháp:** 
- Check console log
- Verify score >= 80%
- Refresh page
- Check ItemCompletion model trong database

### Lỗi Video Player

**Lỗi:** Video không play
**Giải pháp:**
- Verify YouTube URL format
- Check internet connection
- Try different video

---

## 📝 Danh Sách Kiểm Tra Hoàn Chỉnh

### Teacher Checklist

- [ ] Tạo khóa học mới
- [ ] Tạo modules
- [ ] Thêm video items
- [ ] Upload PDF slides
- [ ] Tạo quiz với nhiều loại câu hỏi
- [ ] Tạo assignment
- [ ] Chấm bài submissions
- [ ] Xem gradebook
- [ ] Trả lời forum posts

### Student Checklist

- [ ] Enroll vào khóa học
- [ ] Xem video với bookmarks
- [ ] Thêm notes trong video
- [ ] Làm quick quiz (pass/fail)
- [ ] Download tài liệu PDF
- [ ] Nộp assignment
- [ ] Làm quiz chính thức
- [ ] Xem điểm trong My Grades
- [ ] Check progress dashboard
- [ ] Đạt 100% → Download certificate

---

## 🚀 Các Bước Tiếp Theo (Optional Enhancements)

### Đã Hoàn Thành ✅
- Sequential Learning System
- Quick Quiz Component
- Content Editor cho giáo viên
- Resource Upload & Management
- Enhanced Video Player
- Progress Dashboard
- UI improvements (logo, dark mode)

### Chưa Làm (Future)
- [ ] Quiz Builder enhancements:
  - Import questions từ JSON/CSV
  - Question bank tái sử dụng
  - Randomize question order
- [ ] Teacher Dashboard improvements:
  - Quick actions cards
  - Analytics widgets
  - Bulk grading
- [ ] Advanced features:
  - Live video streaming
  - Real-time collaboration
  - AI-powered recommendations
  - Mobile app

---

## 📞 Hỗ Trợ

Nếu gặp vấn đề:
1. Check console logs (F12 → Console)
2. Check network tab for failed API calls
3. Verify backend is running (port 5000)
4. Verify frontend is running (port 3000)
5. Check MongoDB connection

---

## 🎉 Kết Luận

Hệ thống LMS giờ đây đã hoàn chỉnh với:
- ✅ Trải nghiệm học tập Coursera-style
- ✅ Công cụ quản lý nội dung cho giáo viên
- ✅ Sequential learning với quiz gating
- ✅ Upload/download tài liệu PDF
- ✅ Enhanced video player với bookmarks/notes
- ✅ Progress tracking & achievements
- ✅ Dữ liệu mẫu đầy đủ để test

**Bạn có thể bắt đầu sử dụng ngay!** 🚀

---

*Last updated: 2024-11-10*
*Version: 2.0 - Comprehensive Edition*
