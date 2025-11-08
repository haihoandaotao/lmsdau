# 🎥 TEST VIDEO LEARNING SYSTEM

## ✅ Đã Setup
- Backend: Running on port 5000
- Frontend: Compiling...
- Database: Đã seed 9 modules với 30 items (videos + reading)

## 📝 Hướng dẫn Test

### 1. Login
```
Email: sinhvien@dau.edu.vn
Password: 123456
```

### 2. Vào Dashboard
- Click vào "Khóa học của tôi"
- Hoặc vào menu "Khóa học"

### 3. Chọn khóa học đã đăng ký
Các khóa học có sẵn:
- **IT201** - Lập trình Web căn bản
- **IT101** - Cấu trúc dữ liệu và Giải thuật
- **AR301** - Thiết kế Kiến trúc

### 4. Click nút "Học ngay" (màu đỏ)
- Sẽ chuyển đến `/courses/:courseId/learn`

### 5. Test Video Player
Kiểm tra các tính năng:

#### ✅ Sidebar Navigation
- [ ] Hiển thị 3 modules
- [ ] Mỗi module có 3-4 items
- [ ] Click expand/collapse modules
- [ ] Icon khác nhau: 🎥 Video, 📄 Reading, ✅ Quiz, 📝 Assignment
- [ ] Item đã xem có icon ✓ màu xanh
- [ ] Hiển thị % tiến độ cho video đang xem

#### ✅ Video Player
- [ ] Video tự động load (YouTube video)
- [ ] Click Play/Pause (▶️/⏸️)
- [ ] Điều chỉnh Volume (🔊)
- [ ] Mute/Unmute
- [ ] Seek video (kéo thanh progress)
- [ ] Thay đổi tốc độ (0.5x, 0.75x, 1x, 1.25x, 1.5x, 2x)
- [ ] Fullscreen (⛶)
- [ ] Hiển thị thời gian: current/total

#### ✅ Progress Tracking
- [ ] Xem video > 5 giây → check Network tab (POST /api/video-progress)
- [ ] Refresh page → video resume từ vị trí đã xem
- [ ] Xem > 90% → icon đổi thành ✓ màu xanh
- [ ] Progress bar ở header cập nhật

#### ✅ Sequential Unlock
- [ ] Click video thứ 2 TRƯỚC khi xem xong video 1
- [ ] Phải hiện alert: "Bạn cần hoàn thành video trước đó"
- [ ] Xem xong video 1 (>90%) → video 2 mở khóa

#### ✅ Tabs
- [ ] Tab "Nội dung": Video player hiển thị
- [ ] Tab "Tổng quan": Hiển thị mô tả khóa học + mục tiêu học tập
- [ ] Tab "Tài nguyên": (Chưa có nội dung)
- [ ] Tab "Thảo luận": (Đang phát triển)

#### ✅ Reading Content
- [ ] Click vào item "Đọc thêm: Lịch sử lập trình"
- [ ] Hiển thị nội dung markdown
- [ ] Format đúng (heading, list, paragraph)

### 6. Test Module Progress
- Vào Network tab của DevTools
- Xem các API calls:
  - `GET /api/modules/course/:courseId` - Load modules
  - `GET /api/video-progress/course/:courseId` - Load progress
  - `POST /api/video-progress` - Save progress (mỗi 5s)
  - `GET /api/video-progress/check-unlock/:moduleId/:itemId` - Check unlock

### 7. Test Responsive
- [ ] Resize browser → sidebar collapse
- [ ] Mobile view → sidebar thành drawer
- [ ] Video player responsive

## 🎯 Demo Videos
Các video YouTube đã seed:
1. **Bài 1: Lập trình là gì?** (10 phút)
2. **Bài 2: Cài đặt môi trường** (15 phút)
3. **Bài 3: Biến trong lập trình** (12 phút)
4. **Bài 4: Kiểu dữ liệu** (14 phút)
5. **Bài 5: Câu lệnh if-else** (16 phút)
6. **Bài 6: Vòng lặp for** (18 phút)
7. **Bài 7: Vòng lặp while** (15 phút)

## 🐛 Bug Checklist
- [ ] Video không load → Check console errors
- [ ] Progress không save → Check Network tab
- [ ] Sequential unlock không hoạt động → Check unlock API
- [ ] Video.js controls không hiện → Check CSS import
- [ ] YouTube video không play → Check videojs-youtube plugin

## 📊 Expected Results
1. ✅ Video player hiển thị controls tiếng Việt
2. ✅ Progress tự động save mỗi 5 giây
3. ✅ Resume từ vị trí đã xem khi reload
4. ✅ Sequential unlock hoạt động
5. ✅ Module navigation mượt mà
6. ✅ Tabs chuyển đổi không lag
7. ✅ Responsive trên mobile/tablet

## 🚀 Next Steps
Sau khi test xong local:
1. Fix bugs nếu có
2. Test trên production (Render)
3. Thêm tính năng mới:
   - Certificates (Chứng chỉ)
   - Enhanced Quizzes (Bài kiểm tra nâng cao)
   - Peer Review (Đánh giá lẫn nhau)
   - Gamification (Điểm, huy hiệu)
