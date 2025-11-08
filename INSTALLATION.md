# Hướng dẫn Cài đặt và Chạy Hệ thống LMS

## Yêu cầu hệ thống

- Node.js (v16 trở lên)
- MongoDB (v5 trở lên)
- npm hoặc yarn

## Cài đặt Backend

1. Mở PowerShell và di chuyển đến thư mục dự án:
```powershell
cd e:\PROJECT\lms
```

2. Cài đặt dependencies:
```powershell
npm install
```

3. File `.env` đã được tạo sẵn, hãy kiểm tra và cập nhật nếu cần

4. Đảm bảo MongoDB đang chạy. Nếu chưa, khởi động MongoDB:
```powershell
# Nếu cài MongoDB làm service
net start MongoDB

# Hoặc chạy trực tiếp
mongod
```

5. Chạy server:
```powershell
npm run dev
```

Server sẽ chạy tại: http://localhost:5000

## Cài đặt Frontend

1. Mở PowerShell mới và di chuyển đến thư mục frontend:
```powershell
cd e:\PROJECT\lms\frontend
```

2. Cài đặt dependencies:
```powershell
npm install
```

3. Chạy React app:
```powershell
npm start
```

Frontend sẽ chạy tại: http://localhost:3000

## Chạy Full Stack cùng lúc

Từ thư mục gốc của dự án:
```powershell
npm run dev:full
```

## Tài khoản test

Sau khi hệ thống chạy, bạn có thể:
1. Đăng ký tài khoản mới tại http://localhost:3000/register
2. Đăng nhập với tài khoản vừa tạo

## Cấu trúc API Endpoints

### Authentication
- POST `/api/auth/register` - Đăng ký
- POST `/api/auth/login` - Đăng nhập
- GET `/api/auth/me` - Lấy thông tin user

### Courses
- GET `/api/courses` - Danh sách khóa học
- POST `/api/courses` - Tạo khóa học (Teacher/Admin)
- GET `/api/courses/:id` - Chi tiết khóa học
- POST `/api/courses/:id/enroll` - Đăng ký khóa học (Student)

### Assignments
- GET `/api/assignments` - Danh sách bài tập
- POST `/api/assignments` - Tạo bài tập (Teacher)
- POST `/api/assignments/:id/submit` - Nộp bài (Student)
- PUT `/api/assignments/submissions/:id/grade` - Chấm điểm (Teacher)

### Forum
- GET `/api/forum/posts` - Danh sách bài viết
- POST `/api/forum/posts` - Tạo bài viết
- POST `/api/forum/posts/:id/comments` - Comment

### Progress
- GET `/api/progress/dashboard` - Dashboard overview
- GET `/api/progress/student/:id` - Tiến độ sinh viên
- GET `/api/progress/course/:id` - Thống kê khóa học

### Notifications
- GET `/api/notifications` - Lấy thông báo
- PUT `/api/notifications/:id/read` - Đánh dấu đã đọc

## Tính năng chính

### 1. Quản lý Người dùng
- ✅ Đăng ký/Đăng nhập
- ✅ 3 vai trò: Student, Teacher, Admin
- ✅ JWT Authentication
- ✅ Phân quyền theo role

### 2. Quản lý Khóa học
- ✅ CRUD khóa học
- ✅ Đăng ký/Hủy đăng ký khóa học
- ✅ Quản lý tài liệu học tập
- ✅ Lịch học

### 3. Bài tập & Kiểm tra
- ✅ Tạo bài tập, quiz, exam
- ✅ Nộp bài trực tuyến
- ✅ Chấm điểm tự động (quiz)
- ✅ Chấm điểm thủ công
- ✅ Feedback

### 4. Diễn đàn
- ✅ Tạo bài viết, thảo luận
- ✅ Comment, reply
- ✅ Like/Unlike
- ✅ Mark as answer (Teacher)
- ✅ Pin/Unpin posts

### 5. Theo dõi Tiến độ
- ✅ Dashboard overview
- ✅ Tiến độ từng sinh viên
- ✅ Thống kê khóa học
- ✅ Báo cáo điểm số
- ✅ Analytics

### 6. Thông báo
- ✅ Real-time notifications (Socket.IO)
- ✅ Thông báo về bài tập mới
- ✅ Thông báo điểm số
- ✅ Announcements
- ✅ Email notifications (placeholder)

## Troubleshooting

### Lỗi kết nối MongoDB
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
Giải pháp: Đảm bảo MongoDB đang chạy

### Lỗi port đã được sử dụng
```
Error: listen EADDRINUSE: address already in use :::5000
```
Giải pháp: Thay đổi PORT trong file .env hoặc tắt ứng dụng đang dùng port 5000

### Lỗi CORS
Nếu gặp lỗi CORS, kiểm tra CLIENT_URL trong file .env backend

## Phát triển thêm

Các tính năng có thể mở rộng:
- Upload file/video
- Video conferencing
- Calendar integration
- Grade export (Excel)
- Mobile app
- Advanced analytics
- Plagiarism detection
- Attendance tracking

## Liên hệ

Nếu có vấn đề, hãy tạo issue hoặc liên hệ admin.
