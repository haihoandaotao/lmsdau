# 🧪 HƯỚNG DẪN TEST HỆ THỐNG LMS

## ✅ Hệ thống đã sẵn sàng!

**URLs:**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

---

## 👥 TÀI KHOẢN TEST

### 🎓 GIÁO VIÊN (Teachers):
1. **teacher1@dau.edu.vn** / 123456 - GV. Nguyễn Văn A
2. **giaovien@dau.edu.vn** / 123456 - GV. Nguyễn Văn An
3. **gvbinh@dau.edu.vn** / 123456 - GV. Trần Thị Bình

### 👨‍🎓 SINH VIÊN (Students):
1. **student1@dau.edu.vn** / 123456 - Trần Thị B
2. **student2@dau.edu.vn** / 123456 - Lê Văn C
3. **sinhvien@gmail.com** / 123456 - Nguyễn Văn A

---

## 📚 KHÓA HỌC CÓ SẴN

### 1. **WEBDEV301 - Phát Triển Web Hiện Đại (Sample)** ⭐
   - Giảng viên: GV. Nguyễn Văn A
   - ✅ **CÓ MODULE + VIDEO + RESOURCES**
   - 👉 **KHUYẾN NGHỊ TEST KHÓA NÀY**

### 2. **DSA201X - Cấu Trúc Dữ Liệu và Giải Thuật (Sample)**
   - Giảng viên: GV. Nguyễn Văn A
   - ✅ CÓ MODULE

### 3. **DB202X - Thiết Kế Cơ Sở Dữ Liệu (Sample)**
   - Giảng viên: GV. Nguyễn Văn A
   - ✅ CÓ MODULE

### 4. **IT101 - Lập trình Web căn bản**
   - Giảng viên: GV. Nguyễn Văn An

### 5. **IT201 - Cấu trúc dữ liệu và Giải thuật**
   - Giảng viên: GV. Trần Thị Bình

---

## 🎯 WORKFLOW TEST CHI TIẾT

### 🔴 PHẦN 1: TEST VỚI TÀI KHOẢN GIÁO VIÊN

#### **Bước 1: Đăng nhập**
1. Mở http://localhost:3000
2. Login: **teacher1@dau.edu.vn** / **123456**
3. ✅ Kiểm tra: Thấy trang "Teacher Dashboard"

#### **Bước 2: Quản lý Module**
1. Click vào khóa học **"Phát Triển Web Hiện Đại (Sample)"**
2. Click nút **"Quản Lý Module"** (góc phải)
3. ✅ Xem danh sách modules
4. Click **"+ Thêm Module"**
   - Nhập tên: "Module Test"
   - Nhập mô tả: "Module để test"
   - Click **"Tạo Module"**
5. ✅ Kiểm tra: Module mới xuất hiện trong danh sách

#### **Bước 3: Chỉnh sửa nội dung Module (ContentEditor)** ⭐
1. Trong danh sách module, tìm module đầu tiên
2. Click nút **"✏️ Edit Content"**
3. ✅ Trang ContentEditor mở ra
4. **Test các tính năng:**

   **A. Thêm Video Item:**
   - Click **"+ Thêm Video"**
   - Nhập:
     - Title: "HTML Basics"
     - Video URL: `https://www.youtube.com/watch?v=UB1O30fR-EE`
     - Description: "Học HTML cơ bản"
   - Click **"Thêm"**
   - ✅ Video xuất hiện trong danh sách items

   **B. Thêm Reading Item:**
   - Click **"+ Thêm Reading"**
   - Nhập:
     - Title: "CSS Tutorial"
     - Content: "# CSS là gì?\n\nCSS là ngôn ngữ..."
   - Click **"Thêm"**
   - ✅ Reading xuất hiện

   **C. Upload PDF/Tài liệu:**
   - Click **"📎 Upload PDF/Tài Liệu"**
   - Click **"Chọn file"**
   - Chọn 1 file PDF từ máy (bất kỳ)
   - Nhập tên: "HTML5 Guide"
   - Nhập mô tả: "Tài liệu tham khảo"
   - Click **"Upload"**
   - ✅ PDF xuất hiện trong phần "Tài nguyên đã upload"

   **D. Reorder items:**
   - Dùng nút ↑ ↓ để thay đổi thứ tự các items
   - ✅ Thứ tự thay đổi ngay lập tức

   **E. Xóa item:**
   - Click nút **🗑️** trên 1 item
   - Confirm xóa
   - ✅ Item biến mất

5. Click **"💾 Lưu Thay Đổi"**
6. ✅ Thông báo "Module updated successfully!"

#### **Bước 4: Xem Progress Dashboard**
1. Quay lại Teacher Dashboard
2. Click vào khóa học
3. ✅ Xem thống kê tiến độ sinh viên

---

### 🔵 PHẦN 2: TEST VỚI TÀI KHOẢN SINH VIÊN

#### **Bước 1: Đăng nhập**
1. **Logout** tài khoản giáo viên (góc phải trên → Logout)
2. Login: **student1@dau.edu.vn** / **123456**
3. ✅ Thấy trang "Student Dashboard"

#### **Bước 2: Xem khóa học**
1. Click vào khóa học **"Phát Triển Web Hiện Đại (Sample)"**
2. ✅ Thấy trang CourseViewer với:
   - Sidebar: Danh sách modules + items
   - Main content: Nội dung bài học
   - Tabs: Nội dung | Tổng quan | Progress | Tài nguyên | Thảo luận

#### **Bước 3: Học video với Enhanced Player** ⭐
1. Click vào item video đầu tiên trong sidebar
2. ✅ Video player hiển thị
3. **Test các tính năng:**

   **A. Play video:**
   - Click play
   - ✅ Video chạy

   **B. Bookmark (Đánh dấu):**
   - Trong khi xem video, click **"🔖 Bookmark"**
   - Nhập title: "Important part"
   - Click **"Save Bookmark"**
   - ✅ Bookmark xuất hiện bên phải

   **C. Note (Ghi chú):**
   - Click **"📝 Note"**
   - Nhập nội dung: "Cần xem lại phần này"
   - Click **"Save Note"**
   - ✅ Note xuất hiện bên phải

   **D. Jump to bookmark:**
   - Click vào bookmark đã tạo
   - ✅ Video nhảy đến thời điểm đó

#### **Bước 4: Làm Quick Quiz để unlock bài tiếp** ⭐
1. Sau khi xem video, xuống phía dưới
2. Thấy box **"📝 Kiểm Tra Nhanh"**
3. Click **"Làm Bài Kiểm Tra"**
4. ✅ Quiz hiển thị với 3 câu hỏi
5. Trả lời ít nhất 2/3 đúng (chọn option đầu tiên là đúng)
6. Click **"Nộp bài"**
7. ✅ Thông báo "Chúc mừng! Bạn đã đạt 100%"
8. ✅ Item tiếp theo trong sidebar được mở khóa (không còn icon 🔒)

#### **Bước 5: Xem tài nguyên (PDFs)** ⭐
1. Click tab **"Tài nguyên"** ở trên
2. ✅ Thấy danh sách PDFs/documents
3. Thông tin hiển thị:
   - 📄 Tên file
   - 📦 Kích thước
   - 📥 Số lượt download
   - 👤 Người upload
4. Click **"📥 Tải xuống"** trên 1 file
5. ✅ File download về máy
6. ✅ Số lượt download tăng lên

#### **Bước 6: Xem Progress Dashboard**
1. Click tab **"📊 Progress"**
2. ✅ Thấy dashboard với:
   - Tổng quan khóa học
   - Tiến độ từng module
   - Điểm quiz
   - Thời gian học
   - Biểu đồ

---

## 🎨 TÍNH NĂNG CHÍNH ĐÃ IMPLEMENT

### ✅ Cho Giáo viên:
- ✅ Content Editor - Chỉnh sửa module
- ✅ Thêm/xóa/reorder video, reading items
- ✅ Upload PDF/Documents (50MB limit)
- ✅ Quản lý resources
- ✅ Xem tiến độ sinh viên

### ✅ Cho Sinh viên:
- ✅ Enhanced Video Player
- ✅ Bookmarks & Notes trong video
- ✅ Quick Quiz (auto-grading)
- ✅ Sequential Learning (unlock system)
- ✅ Resources Tab (download PDFs)
- ✅ Progress Dashboard
- ✅ Video progress tracking

---

## 🐛 TROUBLESHOOTING

### ❌ Không thấy video:
- Kiểm tra URL video có hợp lệ không (YouTube/Vimeo)
- Refresh trang (F5)

### ❌ Không upload được PDF:
- File phải < 50MB
- Format: PDF, DOC, DOCX, PPT, PPTX

### ❌ Không tạo được bookmark:
- Kiểm tra backend có chạy không (port 5000)
- Check console (F12) xem có lỗi API

### ❌ Quiz không pass:
- Phải đạt ít nhất 2/3 đúng (67%)
- Chọn câu trả lời đầu tiên là đúng

---

## 🎯 TEST SCENARIOS QUAN TRỌNG

### Scenario 1: Teacher uploads PDF → Student downloads
1. Teacher login → ContentEditor → Upload PDF
2. Logout
3. Student login → Tài nguyên tab → Download PDF
4. ✅ Verify: File download thành công

### Scenario 2: Student completes quiz → Next item unlocks
1. Student login → Vào module
2. Item 2 bị lock (🔒)
3. Làm quiz của item 1 → Pass
4. ✅ Verify: Item 2 mở khóa

### Scenario 3: Video progress saves
1. Student xem video đến 50%
2. Refresh trang
3. ✅ Verify: Video tiếp tục từ 50%

---

## 📝 NOTES

- Tất cả password là: **123456**
- Backend API: http://localhost:5000/api
- MongoDB: Atlas Cloud
- File uploads: Lưu tại `backend/uploads/resources/`

---

**🚀 BẮT ĐẦU TEST TỪ KHÓA "Phát Triển Web Hiện Đại (Sample)"**
**📧 Login: teacher1@dau.edu.vn / 123456 (Teacher)**
**📧 Login: student1@dau.edu.vn / 123456 (Student)**
