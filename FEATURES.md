# 📚 Tài liệu Chi tiết Các Tính năng LMS-DAU

Hệ thống Quản lý Học tập (Learning Management System) cho Trường Đại học Kiến trúc Đà Nẵng

---

## 📋 Mục lục
1. [Quản lý Người dùng](#1-quản-lý-người-dùng-user-management)
2. [Quản lý Khóa học](#2-quản-lý-khóa-học-course-management)
3. [Quản lý Bài tập & Kiểm tra](#3-quản-lý-bài-tập--kiểm-tra-assignment--assessment)
4. [Diễn đàn & Thảo luận](#4-diễn-đàn--thảo-luận-forum--discussion)
5. [Theo dõi Tiến độ](#5-theo-dõi-tiến-độ-progress-tracking)
6. [Thông báo](#6-thông-báo-notifications)

---

## 1. Quản lý Người dùng (User Management)

### 1.1. Vai trò Người dùng

Hệ thống hỗ trợ 3 vai trò chính:

#### 🎓 **Sinh viên (Student)**
- Đăng ký và tham gia khóa học
- Nộp bài tập, làm bài kiểm tra
- Xem điểm số và tiến độ học tập
- Tham gia diễn đàn thảo luận
- Nhận thông báo từ giảng viên

**Thông tin sinh viên:**
- `studentId`: Mã sinh viên (unique)
- `major`: Chuyên ngành
- `enrolledCourses`: Danh sách khóa học đã đăng ký
- `gpa`: Điểm trung bình tích lũy

#### 👨‍🏫 **Giảng viên (Teacher)**
- Tạo và quản lý khóa học
- Tạo bài tập, bài kiểm tra
- Chấm điểm và đánh giá sinh viên
- Quản lý nội dung học tập
- Trả lời câu hỏi trong diễn đàn
- Xem báo cáo thống kê lớp học

**Thông tin giảng viên:**
- `teacherId`: Mã giảng viên (unique)
- `department`: Khoa/Bộ môn
- `teachingCourses`: Danh sách khóa học đang giảng dạy
- `specialization`: Chuyên môn

#### 👑 **Quản trị viên (Admin)**
- Quản lý toàn bộ người dùng (CRUD)
- Quản lý tất cả khóa học
- Xem báo cáo tổng quan hệ thống
- Cấu hình hệ thống
- Xóa dữ liệu

### 1.2. Đăng ký & Đăng nhập

#### **Đăng ký (Registration)**

**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "name": "Nguyễn Văn A",
  "email": "nguyenvana@dau.edu.vn",
  "password": "123456",
  "role": "student",
  "studentId": "SV001",
  "major": "Công nghệ Thông tin",
  "phone": "0901234567",
  "address": "Đà Nẵng"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "name": "Nguyễn Văn A",
    "email": "nguyenvana@dau.edu.vn",
    "role": "student",
    "studentId": "SV001"
  },
  "token": "JWT_TOKEN"
}
```

**Validation:**
- Email phải đúng định dạng và unique
- Password tối thiểu 6 ký tự
- StudentId/TeacherId phải unique nếu cung cấp
- Role mặc định là 'student' nếu không chỉ định

#### **Đăng nhập (Login)**

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "giaovien@dau.edu.vn",
  "password": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "name": "GV. Nguyễn Văn An",
    "email": "giaovien@dau.edu.vn",
    "role": "teacher",
    "department": "Khoa Công nghệ Thông tin"
  },
  "token": "JWT_TOKEN"
}
```

**Security:**
- Password được hash bằng bcrypt (10 rounds)
- JWT token có thời gian expire 30 ngày
- Token được lưu trong localStorage phía client
- Mỗi request cần gửi token trong header: `Authorization: Bearer {token}`

### 1.3. Phân quyền (Authorization)

**Middleware phân quyền:**
```javascript
// Bảo vệ route - yêu cầu đăng nhập
router.use(protect);

// Phân quyền theo role
router.post('/courses', authorize('teacher', 'admin'), createCourse);
router.delete('/users/:id', authorize('admin'), deleteUser);
```

**Quyền hạn theo vai trò:**

| Chức năng | Student | Teacher | Admin |
|-----------|---------|---------|-------|
| Xem khóa học | ✅ | ✅ | ✅ |
| Tạo khóa học | ❌ | ✅ | ✅ |
| Xóa khóa học | ❌ | ❌ | ✅ |
| Đăng ký khóa học | ✅ | ❌ | ❌ |
| Tạo bài tập | ❌ | ✅ | ✅ |
| Nộp bài tập | ✅ | ❌ | ❌ |
| Chấm điểm | ❌ | ✅ | ✅ |
| Quản lý user | ❌ | ❌ | ✅ |

### 1.4. Quản lý Hồ sơ (Profile Management)

#### **Xem thông tin cá nhân**

**Endpoint:** `GET /api/auth/me`

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "name": "Nguyễn Văn A",
    "email": "student@dau.edu.vn",
    "role": "student",
    "studentId": "SV001",
    "major": "Công nghệ Thông tin",
    "enrolledCourses": [...],
    "avatar": "avatar_url",
    "createdAt": "2025-01-01",
    "lastLogin": "2025-11-08"
  }
}
```

#### **Cập nhật thông tin**

**Endpoint:** `PUT /api/auth/updatedetails`

**Request Body:**
```json
{
  "name": "Nguyễn Văn A Updated",
  "phone": "0901234567",
  "address": "123 Đường ABC, Đà Nẵng"
}
```

#### **Đổi mật khẩu**

**Endpoint:** `PUT /api/auth/updatepassword`

**Request Body:**
```json
{
  "currentPassword": "123456",
  "newPassword": "newpassword123"
}
```

### 1.5. Quản lý Người dùng (Admin only)

#### **Danh sách người dùng**

**Endpoint:** `GET /api/users`

**Query Parameters:**
- `role`: Lọc theo vai trò (student/teacher/admin)
- `department`: Lọc theo khoa
- `page`: Trang hiện tại
- `limit`: Số lượng/trang

**Response:**
```json
{
  "success": true,
  "count": 50,
  "data": [
    {
      "_id": "user_id",
      "name": "Nguyễn Văn A",
      "email": "student@dau.edu.vn",
      "role": "student",
      "studentId": "SV001",
      "createdAt": "2025-01-01"
    }
  ]
}
```

#### **Chi tiết người dùng**

**Endpoint:** `GET /api/users/:id`

#### **Cập nhật người dùng**

**Endpoint:** `PUT /api/users/:id`

#### **Xóa người dùng**

**Endpoint:** `DELETE /api/users/:id`

---

## 2. Quản lý Khóa học (Course Management)

### 2.1. Cấu trúc Khóa học

**Course Model:**
```javascript
{
  code: "IT101",                    // Mã môn học
  title: "Lập trình Web căn bản",  // Tên khóa học
  description: "...",               // Mô tả chi tiết
  instructor: ObjectId,             // Giảng viên
  department: "Công nghệ TT",       // Khoa
  credits: 3,                       // Số tín chỉ
  year: 1,                          // Năm học
  semester: 1,                      // Học kỳ
  schedule: "Thứ 2, 4 (7-9h)",     // Lịch học
  room: "A101",                     // Phòng học
  maxStudents: 40,                  // Số SV tối đa
  enrolledStudents: [...],          // DS SV đã đăng ký
  materials: [...],                 // Tài liệu học tập
  syllabus: "...",                  // Đề cương môn học
  requirements: "...",              // Yêu cầu đầu vào
  isActive: true                    // Trạng thái
}
```

### 2.2. CRUD Khóa học (Teacher/Admin)

#### **Tạo khóa học mới**

**Endpoint:** `POST /api/courses`

**Request Body:**
```json
{
  "code": "IT101",
  "title": "Lập trình Web căn bản",
  "description": "Khóa học giới thiệu về HTML, CSS, JavaScript...",
  "department": "Công nghệ Thông tin",
  "credits": 3,
  "year": 1,
  "semester": 1,
  "schedule": "Thứ 2, 4 (7:00-9:00)",
  "room": "A101",
  "maxStudents": 40,
  "syllabus": "Nội dung đề cương...",
  "requirements": "Không yêu cầu kiến thức đầu vào"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "course_id",
    "code": "IT101",
    "title": "Lập trình Web căn bản",
    "instructor": {
      "_id": "teacher_id",
      "name": "GV. Nguyễn Văn An"
    },
    "enrolledStudents": [],
    "createdAt": "2025-11-08"
  }
}
```

#### **Danh sách khóa học**

**Endpoint:** `GET /api/courses`

**Query Parameters:**
- `department`: Lọc theo khoa
- `year`: Lọc theo năm
- `semester`: Lọc theo học kỳ
- `instructor`: Lọc theo giảng viên
- `search`: Tìm kiếm theo tên/mã

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "course_id",
      "code": "IT101",
      "title": "Lập trình Web căn bản",
      "instructor": {
        "name": "GV. Nguyễn Văn An",
        "department": "Khoa CNTT"
      },
      "credits": 3,
      "schedule": "Thứ 2, 4 (7-9h)",
      "enrolledCount": 25,
      "maxStudents": 40
    }
  ]
}
```

#### **Chi tiết khóa học**

**Endpoint:** `GET /api/courses/:id`

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "course_id",
    "code": "IT101",
    "title": "Lập trình Web căn bản",
    "description": "...",
    "instructor": {
      "_id": "teacher_id",
      "name": "GV. Nguyễn Văn An",
      "email": "giaovien@dau.edu.vn",
      "department": "Khoa CNTT"
    },
    "materials": [
      {
        "title": "Slide bài 1",
        "type": "pdf",
        "url": "/uploads/slide1.pdf",
        "uploadedAt": "2025-11-01"
      }
    ],
    "enrolledStudents": [...],
    "assignments": [...],
    "syllabus": "...",
    "schedule": "Thứ 2, 4 (7-9h)"
  }
}
```

#### **Cập nhật khóa học**

**Endpoint:** `PUT /api/courses/:id`

**Request Body:**
```json
{
  "title": "Lập trình Web nâng cao",
  "description": "Cập nhật mô tả...",
  "schedule": "Thứ 3, 5 (9-11h)",
  "room": "B202"
}
```

#### **Xóa khóa học**

**Endpoint:** `DELETE /api/courses/:id` (Admin only)

### 2.3. Quản lý Nội dung Học tập

#### **Thêm tài liệu học tập**

**Endpoint:** `POST /api/courses/:id/materials`

**Request (multipart/form-data):**
```
title: "Slide Bài 1 - Giới thiệu HTML"
description: "Slide giới thiệu cơ bản về HTML"
type: "pdf" | "video" | "document" | "link"
file: [File upload]
url: "https://youtube.com/..." (nếu type là link)
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "material_id",
    "title": "Slide Bài 1",
    "type": "pdf",
    "url": "/uploads/courses/course_id/slide1.pdf",
    "size": 2048576,
    "uploadedBy": "teacher_id",
    "uploadedAt": "2025-11-08"
  }
}
```

**Các loại tài liệu hỗ trợ:**
- **PDF**: Slide bài giảng, tài liệu tham khảo
- **Video**: Bài giảng video (MP4, AVI)
- **Document**: Word, Excel, PowerPoint
- **Link**: YouTube, Google Drive, website

#### **Xóa tài liệu**

**Endpoint:** `DELETE /api/courses/:id/materials/:materialId`

### 2.4. Đăng ký Khóa học (Student)

#### **Đăng ký khóa học**

**Endpoint:** `POST /api/courses/:id/enroll`

**Response:**
```json
{
  "success": true,
  "message": "Đăng ký khóa học thành công",
  "data": {
    "course": {
      "_id": "course_id",
      "title": "Lập trình Web căn bản"
    },
    "enrolledAt": "2025-11-08"
  }
}
```

**Validation:**
- Kiểm tra số lượng sinh viên (maxStudents)
- Kiểm tra trùng lịch
- Kiểm tra điều kiện tiên quyết (nếu có)
- Không được đăng ký trùng

#### **Hủy đăng ký**

**Endpoint:** `POST /api/courses/:id/unenroll`

**Điều kiện hủy:**
- Trong thời gian cho phép (trước 2 tuần)
- Chưa có bài tập đã nộp
- Được giảng viên cho phép

### 2.5. Lịch học & Thời khóa biểu

**Endpoint:** `GET /api/courses/my-schedule`

**Response:**
```json
{
  "success": true,
  "data": {
    "monday": [
      {
        "courseCode": "IT101",
        "courseTitle": "Lập trình Web",
        "time": "7:00-9:00",
        "room": "A101",
        "instructor": "GV. Nguyễn Văn An"
      }
    ],
    "tuesday": [...],
    "wednesday": [...],
    "thursday": [...],
    "friday": [...],
    "saturday": [...]
  }
}
```

---

## 3. Quản lý Bài tập & Kiểm tra (Assignment & Assessment)

### 3.1. Cấu trúc Bài tập

**Assignment Model:**
```javascript
{
  title: "Bài tập 1: HTML CSS",
  description: "Tạo trang web CV cá nhân",
  course: ObjectId,
  type: "assignment" | "quiz" | "exam",
  dueDate: Date,
  totalPoints: 10,
  attachments: [...],
  requirements: "Yêu cầu chi tiết...",
  rubric: {
    criteria: [...],
    grading: [...]
  },
  allowLateSubmission: true,
  latePenalty: 10,  // % penalty per day
  maxAttempts: 3,
  isPublished: true
}
```

### 3.2. Tạo & Quản lý Bài tập (Teacher)

#### **Tạo bài tập mới**

**Endpoint:** `POST /api/assignments`

**Request Body:**
```json
{
  "title": "Bài tập 1: Tạo trang web CV",
  "description": "Sinh viên tạo trang web CV cá nhân sử dụng HTML và CSS...",
  "course": "course_id",
  "type": "assignment",
  "dueDate": "2025-11-15T23:59:59",
  "totalPoints": 10,
  "requirements": "- Sử dụng HTML5 semantic tags\n- Responsive design\n- CSS Grid/Flexbox",
  "allowLateSubmission": true,
  "latePenalty": 10,
  "maxAttempts": 2,
  "attachments": [
    {
      "title": "Hướng dẫn",
      "url": "/uploads/guide.pdf"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "assignment_id",
    "title": "Bài tập 1: Tạo trang web CV",
    "course": {
      "_id": "course_id",
      "title": "Lập trình Web căn bản"
    },
    "dueDate": "2025-11-15T23:59:59",
    "totalPoints": 10,
    "createdAt": "2025-11-08"
  }
}
```

#### **Danh sách bài tập**

**Endpoint:** `GET /api/assignments`

**Query Parameters:**
- `course`: Lọc theo khóa học
- `type`: Lọc theo loại (assignment/quiz/exam)
- `status`: Lọc theo trạng thái (upcoming/ongoing/past)

**Response (Student):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "assignment_id",
      "title": "Bài tập 1: HTML CSS",
      "course": {
        "title": "Lập trình Web",
        "code": "IT101"
      },
      "dueDate": "2025-11-15T23:59:59",
      "totalPoints": 10,
      "mySubmission": {
        "status": "graded",
        "score": 8.5,
        "submittedAt": "2025-11-10"
      },
      "daysRemaining": 5,
      "isOverdue": false
    }
  ]
}
```

**Response (Teacher):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "assignment_id",
      "title": "Bài tập 1: HTML CSS",
      "course": "IT101",
      "dueDate": "2025-11-15T23:59:59",
      "totalPoints": 10,
      "submissionCount": 25,
      "gradedCount": 15,
      "pendingCount": 10,
      "averageScore": 7.8
    }
  ]
}
```

#### **Chi tiết bài tập**

**Endpoint:** `GET /api/assignments/:id`

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "assignment_id",
    "title": "Bài tập 1: Tạo trang web CV",
    "description": "...",
    "course": {
      "_id": "course_id",
      "title": "Lập trình Web căn bản",
      "instructor": {
        "name": "GV. Nguyễn Văn An"
      }
    },
    "dueDate": "2025-11-15T23:59:59",
    "totalPoints": 10,
    "requirements": "...",
    "attachments": [...],
    "mySubmission": {
      "_id": "submission_id",
      "status": "submitted",
      "submittedAt": "2025-11-10",
      "files": [...],
      "score": null,
      "feedback": null
    },
    "allowLateSubmission": true,
    "maxAttempts": 2,
    "attemptsUsed": 1
  }
}
```

#### **Cập nhật bài tập**

**Endpoint:** `PUT /api/assignments/:id`

#### **Xóa bài tập**

**Endpoint:** `DELETE /api/assignments/:id`

### 3.3. Nộp Bài tập (Student)

#### **Nộp bài**

**Endpoint:** `POST /api/assignments/:id/submit`

**Request (multipart/form-data):**
```
files: [File1, File2, ...]
content: "Mô tả bài làm, link demo..."
githubUrl: "https://github.com/user/repo"
demoUrl: "https://demo-site.com"
```

**Response:**
```json
{
  "success": true,
  "message": "Nộp bài thành công",
  "data": {
    "_id": "submission_id",
    "assignment": "assignment_id",
    "student": "student_id",
    "submittedAt": "2025-11-10T15:30:00",
    "status": "submitted",
    "files": [
      {
        "filename": "cv-website.zip",
        "url": "/uploads/submissions/file.zip",
        "size": 1024000
      }
    ],
    "content": "Mô tả bài làm...",
    "isLate": false
  }
}
```

**Validation:**
- Kiểm tra deadline
- Kiểm tra số lần nộp (maxAttempts)
- Giới hạn kích thước file (50MB)
- Định dạng file cho phép

#### **Xem bài đã nộp**

**Endpoint:** `GET /api/assignments/my-submissions`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "submission_id",
      "assignment": {
        "title": "Bài tập 1: HTML CSS",
        "course": "Lập trình Web"
      },
      "submittedAt": "2025-11-10",
      "status": "graded",
      "score": 8.5,
      "totalPoints": 10,
      "feedback": "Bài làm tốt. Cần cải thiện responsive..."
    }
  ]
}
```

### 3.4. Chấm điểm (Teacher)

#### **Danh sách bài nộp**

**Endpoint:** `GET /api/assignments/:id/submissions`

**Response:**
```json
{
  "success": true,
  "data": {
    "assignment": {
      "title": "Bài tập 1: HTML CSS",
      "totalPoints": 10
    },
    "submissions": [
      {
        "_id": "submission_id",
        "student": {
          "_id": "student_id",
          "name": "Nguyễn Văn A",
          "studentId": "SV001"
        },
        "submittedAt": "2025-11-10T15:30:00",
        "status": "submitted",
        "isLate": false,
        "files": [...],
        "score": null
      }
    ],
    "stats": {
      "total": 30,
      "submitted": 25,
      "graded": 15,
      "pending": 10,
      "late": 3
    }
  }
}
```

#### **Chấm điểm & Feedback**

**Endpoint:** `PUT /api/assignments/submissions/:id/grade`

**Request Body:**
```json
{
  "score": 8.5,
  "feedback": "Bài làm tốt. Điểm mạnh:\n- Code HTML semantic đúng\n- CSS responsive tốt\n\nCần cải thiện:\n- Tối ưu hóa hình ảnh\n- Thêm meta tags SEO",
  "rubricScores": {
    "htmlStructure": 3,
    "cssDesign": 3,
    "responsive": 2,
    "codeQuality": 0.5
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Chấm điểm thành công",
  "data": {
    "_id": "submission_id",
    "score": 8.5,
    "totalPoints": 10,
    "feedback": "...",
    "gradedBy": "teacher_id",
    "gradedAt": "2025-11-12",
    "status": "graded"
  }
}
```

**Tự động gửi thông báo cho sinh viên khi chấm xong**

### 3.5. Bài kiểm tra Trắc nghiệm (Quiz)

#### **Tạo Quiz**

**Endpoint:** `POST /api/assignments` (type: "quiz")

**Request Body:**
```json
{
  "title": "Quiz 1: HTML Basics",
  "description": "Kiểm tra kiến thức HTML cơ bản",
  "course": "course_id",
  "type": "quiz",
  "dueDate": "2025-11-20T23:59:59",
  "totalPoints": 10,
  "duration": 30,  // phút
  "questions": [
    {
      "question": "HTML là viết tắt của?",
      "type": "multiple-choice",
      "options": [
        "HyperText Markup Language",
        "HighText Machine Language",
        "HyperTech Modern Language",
        "None of the above"
      ],
      "correctAnswer": 0,
      "points": 1
    },
    {
      "question": "Tag nào dùng để tạo đoạn văn?",
      "type": "multiple-choice",
      "options": ["<paragraph>", "<p>", "<text>", "<para>"],
      "correctAnswer": 1,
      "points": 1
    }
  ],
  "randomizeQuestions": true,
  "showResultsImmediately": false,
  "allowReview": true
}
```

#### **Làm Quiz**

**Endpoint:** `POST /api/assignments/:id/submit` (quiz answers)

**Request Body:**
```json
{
  "answers": [
    { "questionIndex": 0, "answer": 0 },
    { "questionIndex": 1, "answer": 1 }
  ],
  "startTime": "2025-11-15T10:00:00",
  "endTime": "2025-11-15T10:25:00"
}
```

**Chấm điểm tự động và trả kết quả ngay**

---

## 4. Diễn đàn & Thảo luận (Forum & Discussion)

### 4.1. Cấu trúc Forum

**ForumPost Model:**
```javascript
{
  title: "Câu hỏi về CSS Flexbox",
  content: "Em chưa hiểu cách dùng justify-content...",
  author: ObjectId,
  course: ObjectId,
  category: "question" | "discussion" | "announcement" | "resource",
  tags: ["css", "flexbox", "layout"],
  attachments: [...],
  likes: [user_ids],
  views: 50,
  isPinned: false,
  isClosed: false,
  hasAnswer: false
}
```

**ForumComment Model:**
```javascript
{
  post: ObjectId,
  author: ObjectId,
  content: "Bạn có thể dùng justify-content: center...",
  attachments: [...],
  likes: [user_ids],
  isAnswer: false,  // Được đánh dấu là câu trả lời đúng
  createdAt: Date
}
```

### 4.2. Tạo & Quản lý Bài viết

#### **Tạo bài viết mới**

**Endpoint:** `POST /api/forum/posts`

**Request Body:**
```json
{
  "title": "Câu hỏi về CSS Flexbox",
  "content": "Em chưa hiểu cách sử dụng justify-content và align-items. Thầy có thể giải thích thêm không ạ?",
  "course": "course_id",
  "category": "question",
  "tags": ["css", "flexbox", "layout"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "post_id",
    "title": "Câu hỏi về CSS Flexbox",
    "author": {
      "name": "Nguyễn Văn A",
      "role": "student",
      "avatar": "..."
    },
    "course": {
      "title": "Lập trình Web"
    },
    "category": "question",
    "tags": ["css", "flexbox", "layout"],
    "createdAt": "2025-11-08T10:00:00",
    "views": 0,
    "comments": 0,
    "likes": 0
  }
}
```

#### **Danh sách bài viết**

**Endpoint:** `GET /api/forum/posts`

**Query Parameters:**
- `course`: Lọc theo khóa học
- `category`: Lọc theo danh mục
- `tag`: Lọc theo tag
- `author`: Lọc theo tác giả
- `search`: Tìm kiếm
- `sort`: Sắp xếp (newest/popular/unanswered)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "post_id",
      "title": "Câu hỏi về CSS Flexbox",
      "author": {
        "name": "Nguyễn Văn A",
        "avatar": "..."
      },
      "course": "Lập trình Web",
      "category": "question",
      "tags": ["css", "flexbox"],
      "views": 25,
      "comments": 5,
      "likes": 3,
      "hasAnswer": true,
      "isPinned": false,
      "createdAt": "2025-11-08",
      "lastActivity": "2025-11-08T15:30:00"
    }
  ]
}
```

#### **Chi tiết bài viết**

**Endpoint:** `GET /api/forum/posts/:id`

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "post_id",
    "title": "Câu hỏi về CSS Flexbox",
    "content": "Em chưa hiểu cách sử dụng...",
    "author": {
      "_id": "student_id",
      "name": "Nguyễn Văn A",
      "role": "student",
      "avatar": "..."
    },
    "course": {
      "title": "Lập trình Web",
      "code": "IT101"
    },
    "category": "question",
    "tags": ["css", "flexbox", "layout"],
    "attachments": [],
    "views": 25,
    "likes": ["user_id1", "user_id2"],
    "comments": [
      {
        "_id": "comment_id",
        "author": {
          "name": "GV. Nguyễn Văn An",
          "role": "teacher"
        },
        "content": "Bạn có thể dùng justify-content để căn chỉnh...",
        "isAnswer": true,
        "likes": 5,
        "createdAt": "2025-11-08T11:00:00"
      }
    ],
    "createdAt": "2025-11-08T10:00:00"
  }
}
```

### 4.3. Bình luận & Tương tác

#### **Thêm bình luận**

**Endpoint:** `POST /api/forum/posts/:id/comments`

**Request Body:**
```json
{
  "content": "Bạn có thể tham khảo bài viết này: https://css-tricks.com/flexbox",
  "attachments": [...]
}
```

#### **Like bài viết**

**Endpoint:** `POST /api/forum/posts/:id/like`

#### **Like bình luận**

**Endpoint:** `POST /api/forum/comments/:id/like`

#### **Đánh dấu câu trả lời đúng** (Teacher only)

**Endpoint:** `PUT /api/forum/comments/:id/mark-answer`

```json
{
  "isAnswer": true
}
```

### 4.4. Các Danh mục (Categories)

1. **Question (Câu hỏi)**: Sinh viên đặt câu hỏi, giảng viên trả lời
2. **Discussion (Thảo luận)**: Thảo luận chung về chủ đề
3. **Announcement (Thông báo)**: Giảng viên thông báo quan trọng
4. **Resource (Tài nguyên)**: Chia sẻ tài liệu, link hữu ích

### 4.5. Tìm kiếm & Lọc

**Tìm kiếm nâng cao:**
```
GET /api/forum/posts?search=flexbox&category=question&hasAnswer=false
```

**Các bộ lọc:**
- Chưa có câu trả lời
- Được đánh dấu quan trọng (pinned)
- Bài viết phổ biến (nhiều like/comment)
- Bài viết mới nhất

---

## 5. Theo dõi Tiến độ (Progress Tracking)

### 5.1. Dashboard Sinh viên

**Endpoint:** `GET /api/progress/dashboard`

**Response (Student):**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalCourses": 4,
      "completedAssignments": 8,
      "pendingAssignments": 3,
      "averageScore": 8.2
    },
    "upcomingAssignments": [
      {
        "title": "Bài tập 3: JavaScript",
        "course": "Lập trình Web",
        "dueDate": "2025-11-15",
        "daysRemaining": 3
      }
    ],
    "recentGrades": [
      {
        "assignment": "Bài tập 2: CSS",
        "course": "Lập trình Web",
        "score": 8.5,
        "totalPoints": 10,
        "gradedAt": "2025-11-10"
      }
    ],
    "courseProgress": [
      {
        "course": "Lập trình Web",
        "progress": 75,
        "completedAssignments": 6,
        "totalAssignments": 8,
        "currentGrade": 8.3
      }
    ]
  }
}
```

### 5.2. Dashboard Giảng viên

**Response (Teacher):**
```json
{
  "success": true,
  "data": {
    "totalCourses": 3,
    "totalStudents": 85,
    "totalAssignments": 12,
    "pendingGrading": 15,
    "courses": [
      {
        "_id": "course_id",
        "title": "Lập trình Web",
        "code": "IT101",
        "enrolledStudents": 30,
        "assignments": 8,
        "pendingSubmissions": 5,
        "averageScore": 7.8
      }
    ],
    "recentSubmissions": [
      {
        "student": "Nguyễn Văn A",
        "assignment": "Bài tập 3",
        "course": "Lập trình Web",
        "submittedAt": "2025-11-08T14:30:00",
        "status": "pending"
      }
    ]
  }
}
```

### 5.3. Dashboard Admin

**Response (Admin):**
```json
{
  "success": true,
  "data": {
    "totalUsers": 500,
    "totalStudents": 450,
    "totalTeachers": 48,
    "totalAdmins": 2,
    "totalCourses": 50,
    "activeCourses": 45,
    "totalAssignments": 200,
    "systemStats": {
      "avgStudentsPerCourse": 28,
      "avgAssignmentsPerCourse": 4,
      "overallAverageScore": 7.5
    },
    "recentActivities": [...]
  }
}
```

### 5.4. Báo cáo Tiến độ Sinh viên

**Endpoint:** `GET /api/progress/student/:id`

**Response:**
```json
{
  "success": true,
  "data": {
    "student": {
      "name": "Nguyễn Văn A",
      "studentId": "SV001",
      "major": "CNTT"
    },
    "enrolledCourses": [
      {
        "course": "Lập trình Web",
        "credits": 3,
        "progress": 75,
        "assignments": [
          {
            "title": "Bài tập 1",
            "score": 8.5,
            "totalPoints": 10,
            "status": "graded"
          }
        ],
        "currentGrade": 8.3,
        "attendance": 90
      }
    ],
    "overallStatistics": {
      "totalCredits": 15,
      "completedCredits": 12,
      "gpa": 8.2,
      "totalAssignments": 20,
      "completedAssignments": 17,
      "onTimeSubmissionRate": 95
    }
  }
}
```

### 5.5. Thống kê Khóa học

**Endpoint:** `GET /api/progress/course/:id`

**Response:**
```json
{
  "success": true,
  "data": {
    "course": {
      "title": "Lập trình Web",
      "code": "IT101",
      "instructor": "GV. Nguyễn Văn An"
    },
    "overview": {
      "enrolledStudents": 30,
      "averageScore": 7.8,
      "passRate": 90,
      "completionRate": 85
    },
    "assignmentStats": [
      {
        "title": "Bài tập 1",
        "submitted": 28,
        "total": 30,
        "graded": 25,
        "averageScore": 8.1,
        "onTimeRate": 90
      }
    ],
    "studentPerformance": [
      {
        "student": {
          "name": "Nguyễn Văn A",
          "studentId": "SV001"
        },
        "completedAssignments": 7,
        "totalAssignments": 8,
        "averageScore": 8.5,
        "ranking": 3
      }
    ],
    "scoreDistribution": {
      "9-10": 5,
      "8-8.9": 10,
      "7-7.9": 8,
      "6-6.9": 5,
      "0-5.9": 2
    }
  }
}
```

### 5.6. Báo cáo & Export

#### **Export điểm sinh viên**

**Endpoint:** `GET /api/progress/course/:id/export`

**Query Parameters:**
- `format`: excel | csv | pdf

**Download file Excel/CSV/PDF chứa:**
- Danh sách sinh viên
- Điểm từng bài tập
- Điểm trung bình
- Xếp hạng

#### **Báo cáo tổng hợp học kỳ**

**Endpoint:** `GET /api/progress/semester-report`

**Query Parameters:**
- `year`: Năm học
- `semester`: Học kỳ

---

## 6. Thông báo (Notifications)

### 6.1. Hệ thống Thông báo Real-time

**Sử dụng Socket.IO cho real-time notifications**

**Client connect:**
```javascript
import io from 'socket.io-client';

const socket = io(API_URL);

// Join personal notification room
socket.emit('join', userId);

// Listen for notifications
socket.on('notification', (data) => {
  console.log('New notification:', data);
  // Show toast/alert
});
```

### 6.2. Các loại Thông báo

#### **1. Thông báo Bài tập**
- Có bài tập mới được tạo
- Sắp đến hạn nộp (3 ngày, 1 ngày, 1 giờ trước)
- Bài tập đã được chấm điểm
- Có feedback mới từ giảng viên

#### **2. Thông báo Khóa học**
- Đăng ký khóa học thành công
- Có tài liệu mới được thêm vào
- Thay đổi lịch học
- Thông báo quan trọng từ giảng viên

#### **3. Thông báo Diễn đàn**
- Có bình luận mới trên bài viết của bạn
- Câu hỏi của bạn đã được trả lời
- Bình luận được đánh dấu là câu trả lời đúng
- Có người like bài viết/bình luận

#### **4. Thông báo Hệ thống**
- Thay đổi mật khẩu thành công
- Đăng nhập từ thiết bị mới
- Cập nhật thông tin cá nhân

### 6.3. API Thông báo

#### **Lấy danh sách thông báo**

**Endpoint:** `GET /api/notifications`

**Query Parameters:**
- `type`: Lọc theo loại
- `isRead`: Lọc đã đọc/chưa đọc
- `page`, `limit`: Phân trang

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "notification_id",
      "type": "assignment_graded",
      "title": "Bài tập đã được chấm điểm",
      "message": "Bài tập 'HTML CSS' đã được chấm điểm: 8.5/10",
      "data": {
        "assignmentId": "assignment_id",
        "submissionId": "submission_id",
        "score": 8.5
      },
      "isRead": false,
      "createdAt": "2025-11-08T15:00:00"
    },
    {
      "_id": "notification_id_2",
      "type": "assignment_due_soon",
      "title": "Sắp đến hạn nộp bài",
      "message": "Bài tập 'JavaScript' sẽ đến hạn trong 24 giờ",
      "data": {
        "assignmentId": "assignment_id",
        "dueDate": "2025-11-09T23:59:59"
      },
      "isRead": false,
      "createdAt": "2025-11-08T08:00:00"
    }
  ],
  "unreadCount": 5
}
```

#### **Đánh dấu đã đọc**

**Endpoint:** `PUT /api/notifications/:id/read`

#### **Đánh dấu tất cả đã đọc**

**Endpoint:** `PUT /api/notifications/read-all`

#### **Xóa thông báo**

**Endpoint:** `DELETE /api/notifications/:id`

### 6.4. Cài đặt Thông báo

**Endpoint:** `PUT /api/notifications/settings`

**Request Body:**
```json
{
  "email": {
    "assignmentDue": true,
    "assignmentGraded": true,
    "newMaterial": true,
    "forumReply": true,
    "scheduleChange": true
  },
  "push": {
    "assignmentDue": true,
    "assignmentGraded": false,
    "newMaterial": false,
    "forumReply": true,
    "scheduleChange": true
  },
  "inApp": {
    "all": true
  }
}
```

### 6.5. Email Notifications

**Gửi email tự động cho:**
- Chào mừng đăng ký mới
- Quên mật khẩu / Reset password
- Bài tập sắp đến hạn (daily digest)
- Bài tập đã được chấm điểm
- Thông báo quan trọng từ giảng viên

---

## 📊 Tổng kết Tính năng

| Module | Tính năng | Trạng thái |
|--------|-----------|------------|
| **User Management** | Đăng ký/Đăng nhập | ✅ |
| | 3 vai trò (Student/Teacher/Admin) | ✅ |
| | JWT Authentication | ✅ |
| | Phân quyền theo role | ✅ |
| | Quản lý hồ sơ | ✅ |
| **Course Management** | CRUD khóa học | ✅ |
| | Đăng ký/Hủy khóa học | ✅ |
| | Quản lý tài liệu | ✅ |
| | Upload file (PDF, Video, Doc) | ✅ |
| | Lịch học & Thời khóa biểu | ✅ |
| **Assignment & Assessment** | Tạo bài tập | ✅ |
| | Nộp bài (file upload) | ✅ |
| | Chấm điểm thủ công | ✅ |
| | Chấm điểm tự động (Quiz) | ✅ |
| | Feedback chi tiết | ✅ |
| | Late submission với penalty | ✅ |
| **Forum & Discussion** | Tạo bài viết | ✅ |
| | Bình luận & Trả lời | ✅ |
| | Like bài viết/comment | ✅ |
| | Đánh dấu câu trả lời đúng | ✅ |
| | Categories & Tags | ✅ |
| | Tìm kiếm & Lọc | ✅ |
| **Progress Tracking** | Dashboard cá nhân hóa | ✅ |
| | Báo cáo tiến độ sinh viên | ✅ |
| | Thống kê khóa học | ✅ |
| | Export điểm (Excel/CSV) | ✅ |
| | GPA & Xếp hạng | ✅ |
| **Notifications** | Real-time notifications | ✅ |
| | Email notifications | ✅ |
| | In-app notifications | ✅ |
| | Notification settings | ✅ |

---

## 🚀 Demo Accounts

### Tài khoản Giảng viên:
```
Email: giaovien@dau.edu.vn
Password: 123456
```

### Tài khoản Sinh viên:
```
Email: student1@dau.edu.vn
Password: 123456
```

### Tài khoản Admin:
```
(Tạo bằng lệnh seed hoặc đăng ký với role: admin)
```

---

## 📞 Hỗ trợ

Nếu có thắc mắc hoặc cần hỗ trợ, vui lòng liên hệ:
- **Website**: https://lmsdau.onrender.com
- **Setup Page**: https://lmsdau.onrender.com/setup/setup.html
- **GitHub**: https://github.com/haihoandaotao/lmsdau

---

**© 2025 LMS-DAU - Trường Đại học Kiến trúc Đà Nẵng**
