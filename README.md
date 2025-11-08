# Learning Management System (LMS)

Hệ thống quản lý học tập cho đại học với đầy đủ chức năng.

## Các Module Chính

1. **Quản lý Người dùng** - Xác thực, phân quyền (sinh viên, giảng viên, admin)
2. **Quản lý Khóa học** - CRUD khóa học, nội dung học tập
3. **Bài tập & Kiểm tra** - Tạo bài tập, chấm điểm tự động/thủ công
4. **Diễn đàn & Thảo luận** - Q&A, tương tác
5. **Theo dõi Tiến độ** - Báo cáo, thống kê
6. **Thông báo** - Real-time notifications

## Công nghệ

- **Backend**: Node.js, Express, MongoDB, Socket.IO
- **Frontend**: React, React Router, Axios
- **Authentication**: JWT
- **Database**: MongoDB với Mongoose

## Cài đặt

1. Clone repository
2. Copy `.env.example` thành `.env` và cấu hình
3. Cài đặt dependencies:
```bash
npm install
cd frontend && npm install
```

4. Khởi động MongoDB
5. Chạy ứng dụng:
```bash
# Backend only
npm run dev

# Full stack (backend + frontend)
npm run dev:full
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Đăng ký
- POST `/api/auth/login` - Đăng nhập
- GET `/api/auth/me` - Lấy thông tin user hiện tại

### Courses
- GET `/api/courses` - Lấy danh sách khóa học
- POST `/api/courses` - Tạo khóa học mới (Teacher/Admin)
- GET `/api/courses/:id` - Chi tiết khóa học
- PUT `/api/courses/:id` - Cập nhật khóa học
- DELETE `/api/courses/:id` - Xóa khóa học

### Assignments
- GET `/api/assignments` - Danh sách bài tập
- POST `/api/assignments` - Tạo bài tập (Teacher)
- POST `/api/assignments/:id/submit` - Nộp bài (Student)
- PUT `/api/assignments/:id/grade` - Chấm điểm (Teacher)

### Forum
- GET `/api/forum/posts` - Danh sách bài viết
- POST `/api/forum/posts` - Tạo bài viết
- POST `/api/forum/posts/:id/comments` - Comment

### Progress
- GET `/api/progress/student/:id` - Tiến độ sinh viên
- GET `/api/progress/course/:id` - Thống kê khóa học

### Notifications
- GET `/api/notifications` - Lấy thông báo
- PUT `/api/notifications/:id/read` - Đánh dấu đã đọc

## License

MIT

## Triển khai trên Render

### 1. File `render.yaml`
Đã bao gồm cấu hình 3 service:
- `lms-api` (Node.js Express)
- `lms-mongo` (MongoDB private service)
- `lms-web` (React static site)

### 2. Các bước triển khai nhanh
1. Push code lên GitHub
2. Vào Render -> New + -> chọn repo
3. Render sẽ detect `render.yaml` => chọn "Enable Blueprint"
4. Sau khi build xong, frontend URL và backend URL sẽ được tự động liên kết thông qua biến môi trường.

### 3. Biến môi trường quan trọng (Render Dashboard)
| Service   | Key            | Mô tả |
|-----------|----------------|------|
| lms-api   | MONGODB_URI    | Override nếu cần dùng MongoDB bên ngoài |
| lms-api   | JWT_SECRET     | Tạo thủ công nếu không dùng generateValue |
| lms-web   | REACT_APP_API_URL | Tự động trỏ đến URL backend |

### 4. Ghi chú bảo mật
- Thay đổi JWT_SECRET trước khi vào production.
- Kích hoạt HTTPS (Render mặc định cung cấp).
- Xem lại chính sách CORS: hiện đang mở, có thể giới hạn domain.

### 5. Nâng cấp Multer
Đã nâng cấp `multer` lên v2 cho bảo mật. Nếu cần upload file thực tế, bổ sung route và giới hạn MIME type.
