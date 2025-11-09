# Hệ thống Gradebook (Bảng điểm) - LMS-DAU

## Tổng quan

Hệ thống Gradebook là **Priority 1, Feature 1** trong kế hoạch nâng cấp LMS-DAU lên chuẩn Moodle/Canvas. Đây là nền tảng cho toàn bộ hệ thống chấm điểm, quản lý điểm số và đánh giá sinh viên.

## Trạng thái: ✅ HOÀN THÀNH

**Ngày hoàn thành**: ${new Date().toLocaleDateString('vi-VN')}
**Thời gian thực hiện**: Phase 1, Week 1

## Tính năng đã triển khai

### 1. Backend API (Node.js/Express)

#### Grade Model (`backend/models/Grade.js`)
```javascript
// Schema chính
{
  student: ObjectId,          // Liên kết đến User
  course: ObjectId,           // Liên kết đến Course
  items: [GradeItemSchema],   // Mảng các mục điểm
  totalEarned: Number,        // Tổng điểm đạt được
  totalPossible: Number,      // Tổng điểm tối đa
  currentGrade: Number,       // Điểm phần trăm hiện tại
  letterGrade: String,        // Điểm chữ (A-F)
  status: String,             // passing/failing/at_risk/incomplete
  lastCalculated: Date        // Lần tính toán cuối
}

// GradeItem Schema - Chi tiết từng mục điểm
{
  itemType: String,           // assignment/quiz/discussion/attendance/manual
  itemId: ObjectId,           // ID của item gốc
  itemName: String,           // Tên bài tập/quiz/etc
  maxPoints: Number,          // Điểm tối đa
  weight: Number,             // Trọng số (%)
  earnedPoints: Number,       // Điểm đạt được
  percentage: Number,         // Phần trăm
  letterGrade: String,        // Điểm chữ cho item này
  submittedAt: Date,          // Ngày nộp
  gradedAt: Date,             // Ngày chấm
  gradedBy: ObjectId,         // Người chấm
  feedback: String,           // Nhận xét
  rubricScores: Mixed,        // Điểm theo rubric
  status: String,             // not_submitted/submitted/graded/late/excused
  isLate: Boolean            // Nộp muộn hay không
}
```

**Methods**:
- `calculateGrade()`: Tính toán điểm tổng với trọng số
- `getLetterGrade(percentage)`: Chuyển đổi điểm số sang điểm chữ
- `addGradeItem(itemData)`: Thêm/cập nhật mục điểm
- `getItemGrade(itemId)`: Lấy điểm của một item cụ thể
- `Grade.getOrCreate(studentId, courseId)`: Tìm hoặc tạo bản ghi điểm
- `Grade.getCourseGradebook(courseId)`: Lấy bảng điểm toàn khóa học

**Indexes**:
- `{ student: 1, course: 1 }` - Compound index unique cho truy vấn nhanh

#### Grade Controller (`backend/controllers/gradeController.js`)

**7 endpoints chính**:

1. **getCourseGradebook** - `GET /api/grades/course/:courseId`
   - Authorization: Teacher/Admin only
   - Trả về: Danh sách điểm tất cả sinh viên + thống kê
   - Statistics: Tổng SV, điểm TB, số SV đạt/không đạt/cảnh báo, phân bố điểm A-F

2. **getStudentGrade** - `GET /api/grades/student/:studentId/course/:courseId`
   - Authorization: Teacher/Admin (all), Student (own only)
   - Trả về: Điểm chi tiết của 1 sinh viên trong khóa học

3. **getMyGrades** - `GET /api/grades/my-grades/:courseId`
   - Authorization: Student only
   - Trả về: Điểm của sinh viên đang đăng nhập
   - Auto-recalculate nếu chưa tính trong 1 giờ

4. **addGradeItem** - `POST /api/grades/item`
   - Authorization: Teacher/Admin only
   - Body: `{ studentId, courseId, itemType, itemName, maxPoints, earnedPoints, feedback, status }`
   - Action: Thêm/cập nhật mục điểm và tự động tính lại tổng điểm

5. **bulkAddGrades** - `POST /api/grades/bulk`
   - Authorization: Teacher/Admin only
   - Body: `{ courseId, itemType, itemName, maxPoints, grades: [{studentId, earnedPoints, feedback}] }`
   - Action: Thêm điểm cho nhiều sinh viên cùng lúc

6. **recalculateGrades** - `POST /api/grades/recalculate/:courseId`
   - Authorization: Teacher/Admin only
   - Action: Tính lại điểm cho tất cả sinh viên trong khóa học

7. **exportGradebook** - `GET /api/grades/export/:courseId`
   - Authorization: Teacher/Admin only
   - Format: CSV file download
   - Columns: Student Name, Email, Current Grade, Letter Grade, Status, Total Earned, Total Possible

#### Routes (`backend/routes/grades.js`)
```javascript
// Student routes
GET  /api/grades/my-grades/:courseId

// Teacher/Admin routes
GET  /api/grades/course/:courseId
GET  /api/grades/student/:studentId/course/:courseId
POST /api/grades/item
POST /api/grades/bulk
POST /api/grades/recalculate/:courseId
GET  /api/grades/export/:courseId
```

### 2. Frontend UI (React + Material-UI)

#### Gradebook Page (Teacher View) - `frontend/src/pages/Gradebook.js`

**Layout**:
1. **Header Section**
   - Tiêu đề "Bảng Điểm" + Course title/code
   - Actions: Recalculate button, Export CSV button

2. **Statistics Cards** (4 cards)
   - Total Students
   - Average Grade
   - Passing Students (green)
   - At-Risk Students (orange)

3. **Charts Section** (2 charts side-by-side)
   - **Pie Chart**: Grade distribution (A: 90-100, B: 80-89, C: 70-79, D: 60-69, F: <60)
   - **Bar Chart**: Student status (Passing, At Risk, Failing)

4. **Filters Section**
   - Search by student name
   - Filter by status (All/Passing/At Risk/Failing/Incomplete)

5. **Gradebook Table** (sortable)
   - Columns: Student Name/Email, Score (%), Letter Grade, Status, Completion Count, Actions
   - Click "View Details" → Opens Grade Detail Dialog

6. **Grade Detail Dialog**
   - Student overview: Current grade, letter grade, total points, status
   - Grade items table: Name, Type, Points, Status for each assignment/quiz/etc

**Features**:
- ✅ Real-time sorting by name or grade
- ✅ Search filter
- ✅ Status filter
- ✅ Colorful charts with recharts
- ✅ CSV export functionality
- ✅ Recalculate all grades
- ✅ Snackbar notifications for all actions

#### StudentGrades Page (Student View) - `frontend/src/pages/StudentGrades.js`

**Layout**:
1. **Overall Grade Card** (gradient background)
   - Large grade display: XX.X% + Letter Grade
   - Total points: X / Y
   - Progress bar
   - Passing status chip

2. **Charts & Statistics** (2 cards side-by-side)
   - **Pie Chart**: Points distribution by type (Assignment, Quiz, Discussion, Attendance, Manual)
   - **Statistics Card**: Count of graded/pending/not submitted/total items

3. **Detailed Grade Items Table**
   - Columns: Name, Type (color-coded chips), Points, Percentage (with progress bar), Status (with icons), Submitted Date
   - Shows feedback if available
   - "Late" badge for late submissions

**Features**:
- ✅ Beautiful gradient card with overall grade
- ✅ Colorful pie chart by assignment type
- ✅ Status icons (✓ graded, ⏰ submitted, ✗ not submitted, ⚠ late)
- ✅ Progress bars for each item
- ✅ Color-coded percentages (green ≥70%, red <70%)
- ✅ Late submission indicator

### 3. Integration với hệ thống

#### App.js Routes
```javascript
<Route path="courses/:courseId/gradebook" element={<Gradebook />} />
<Route path="courses/:courseId/my-grades" element={<StudentGrades />} />
```

#### CourseDetail.js Updates
- **Teacher/Admin**: Nút "Bảng điểm" → Navigate to Gradebook
- **Student**: Nút "Xem điểm của tôi" → Navigate to StudentGrades

#### server.js
```javascript
const gradeRoutes = require('./routes/grades');
app.use('/api/grades', gradeRoutes);
```

## Công nghệ sử dụng

### Backend
- **Node.js** + **Express**: RESTful API
- **MongoDB** + **Mongoose**: Database với compound indexes
- **JWT**: Authorization middleware

### Frontend
- **React 18**: Component-based UI
- **Material-UI v5**: Components, Grid, Dialog, Snackbar, Chip, Table
- **Recharts**: PieChart, BarChart, ResponsiveContainer
- **React Router**: Navigation
- **Axios**: HTTP requests

## Cách sử dụng

### Dành cho Giáo viên

1. **Truy cập Gradebook**:
   - Vào trang Course Detail → Click "Bảng điểm"
   - Hoặc truy cập trực tiếp: `/courses/:courseId/gradebook`

2. **Xem tổng quan**:
   - Statistics cards: Số sinh viên, điểm TB, SV đạt/cảnh báo
   - Charts: Phân bố điểm và trạng thái

3. **Tìm kiếm/Lọc**:
   - Nhập tên sinh viên vào ô tìm kiếm
   - Chọn status filter (Đạt/Cảnh báo/Không đạt)

4. **Sắp xếp**:
   - Click vào header columns để sort (Name, Grade)

5. **Xem chi tiết sinh viên**:
   - Click icon 📊 ở cột Actions
   - Dialog hiển thị breakdown từng mục điểm

6. **Thao tác**:
   - **Recalculate**: Click icon 🔄 để tính lại tất cả điểm
   - **Export CSV**: Click icon 📥 để download bảng điểm

7. **Thêm điểm** (via API):
   ```javascript
   POST /api/grades/item
   {
     "studentId": "...",
     "courseId": "...",
     "itemType": "assignment",
     "itemName": "Bài tập 1",
     "maxPoints": 100,
     "earnedPoints": 85,
     "feedback": "Làm tốt!"
   }
   ```

### Dành cho Sinh viên

1. **Xem điểm của mình**:
   - Vào Course Detail → Click "Xem điểm của tôi"
   - Hoặc truy cập: `/courses/:courseId/my-grades`

2. **Thông tin hiển thị**:
   - Điểm tổng, điểm chữ, trạng thái đạt/không đạt
   - Progress bar cho điểm hiện tại
   - Pie chart: Phân bố điểm theo loại bài tập
   - Statistics: Số bài đã chấm/chờ chấm/chưa nộp

3. **Chi tiết từng bài**:
   - Bảng liệt kê tất cả assignments/quizzes
   - Điểm, phần trăm, trạng thái, ngày nộp
   - Feedback từ giáo viên (nếu có)
   - Badge "Nộp muộn" nếu late

## Tính toán điểm

### Letter Grade System
| Percentage | Letter Grade |
|-----------|--------------|
| 90-100    | A            |
| 80-89     | B            |
| 70-79     | C            |
| 60-69     | D            |
| <60       | F            |

### Status System
- **passing**: currentGrade ≥ passingGrade (default 50%)
- **failing**: currentGrade < 50%
- **at_risk**: currentGrade ≥ 50% but < 60%
- **incomplete**: Chưa có điểm nào

### Weighted Average
```javascript
calculateGrade() {
  let totalWeighted = 0;
  let totalWeight = 0;
  
  this.items.forEach(item => {
    if (item.status === 'graded') {
      totalWeighted += item.percentage * (item.weight / 100);
      totalWeight += item.weight;
    }
  });
  
  this.currentGrade = totalWeight > 0 
    ? totalWeighted / (totalWeight / 100)
    : 0;
}
```

## Testing Checklist

- [✅] Backend API endpoints hoạt động
- [✅] Authorization middleware (teacher vs student)
- [✅] Grade calculation accuracy
- [✅] Teacher can view all students' grades
- [✅] Student can only view own grades
- [✅] Charts render correctly (recharts)
- [✅] CSV export downloads file
- [✅] Recalculate updates all grades
- [✅] Search/filter/sort functions work
- [✅] Responsive design on mobile
- [✅] Error handling with Snackbar
- [✅] Loading states with Skeleton

## Performance Optimization

1. **Database**:
   - Compound index `{student: 1, course: 1}` cho truy vấn nhanh
   - Populate only necessary fields (`name`, `email`)

2. **Frontend**:
   - Lazy loading cho Gradebook/StudentGrades components
   - Memoization với useMemo cho chart data
   - Debounce search input (có thể thêm sau)

3. **Caching**:
   - Auto-recalculate only if lastCalculated > 1 hour
   - Reduce unnecessary API calls

## Điểm khác biệt với Moodle/Canvas

### ✅ Có sẵn:
- Weighted scoring system
- Letter grade conversion
- CSV export
- Grade status tracking
- Teacher/student separate views
- Visual charts

### 🔄 Cần bổ sung (Phase tiếp theo):
- Grade categories with weights (Quiz 30%, Assignment 40%, Final 30%)
- Extra credit support
- Grade curves/scaling
- Grade history/audit trail
- Grade comments thread
- Grade rubrics builder
- Late penalty configuration
- Drop lowest score

## Tích hợp với features khác

Gradebook là **foundation** cho các tính năng sau:

### 📝 Assignment Submission (Phase 1, Week 2)
- Khi chấm assignment → Auto create grade item
- Status: not_submitted → submitted → graded
- Late submissions auto-marked

### 📊 Quiz System (Phase 1, Week 2)
- Auto-grading cho MCQ/True-False
- Quiz results → Grade items
- Instant feedback for students

### 💬 Discussion Forums (Phase 2, Week 3)
- Participation points → Grade items
- Manual grading for quality

### 📅 Attendance (Phase 3, Week 5)
- Attendance records → Grade items
- Automatic calculation

## API Usage Examples

### Teacher: Get course gradebook
```javascript
GET /api/grades/course/64abc123...
Authorization: Bearer <teacher_token>

Response:
{
  "success": true,
  "data": {
    "grades": [...],
    "stats": {
      "totalStudents": 25,
      "averageGrade": 78.5,
      "passingStudents": 20,
      "failingStudents": 2,
      "atRiskStudents": 3,
      "gradeDistribution": { A: 5, B: 10, C: 7, D: 2, F: 1 }
    },
    "course": { _id, title, code }
  }
}
```

### Teacher: Add grade for assignment
```javascript
POST /api/grades/item
Authorization: Bearer <teacher_token>
{
  "studentId": "64student123...",
  "courseId": "64course123...",
  "itemType": "assignment",
  "itemName": "Bài tập tuần 1",
  "maxPoints": 100,
  "earnedPoints": 85,
  "feedback": "Làm tốt lắm! Cần chú ý format code."
}

Response:
{
  "success": true,
  "message": "Grade item added successfully",
  "data": { ... grade object ... }
}
```

### Teacher: Bulk add grades
```javascript
POST /api/grades/bulk
Authorization: Bearer <teacher_token>
{
  "courseId": "64course123...",
  "itemType": "quiz",
  "itemName": "Quiz Chapter 1",
  "maxPoints": 50,
  "grades": [
    { "studentId": "64s1...", "earnedPoints": 45, "feedback": "Perfect!" },
    { "studentId": "64s2...", "earnedPoints": 40, "feedback": "Good job" },
    { "studentId": "64s3...", "earnedPoints": 35, "feedback": "Review Q5" }
  ]
}
```

### Student: Get own grades
```javascript
GET /api/grades/my-grades/64course123...
Authorization: Bearer <student_token>

Response:
{
  "success": true,
  "data": {
    "currentGrade": 82.5,
    "letterGrade": "B",
    "status": "passing",
    "totalEarned": 165,
    "totalPossible": 200,
    "items": [
      {
        "itemType": "assignment",
        "itemName": "Bài tập 1",
        "earnedPoints": 85,
        "maxPoints": 100,
        "percentage": 85,
        "status": "graded",
        "feedback": "Excellent work!"
      },
      ...
    ],
    "course": { title, code, passingGrade },
    "isPassing": true
  }
}
```

## File Structure

```
backend/
├── models/
│   └── Grade.js                    // Grade model with schema & methods
├── controllers/
│   └── gradeController.js          // 7 controller functions
├── routes/
│   └── grades.js                   // Grade routes with auth
└── server.js                       // Grade routes registered

frontend/
├── src/
│   ├── pages/
│   │   ├── Gradebook.js           // Teacher gradebook view
│   │   └── StudentGrades.js       // Student grades view
│   └── App.js                     // Routes added

package.json                        // recharts added to dependencies
```

## Deployment Notes

### Environment Variables
Không cần thêm biến môi trường mới. Sử dụng:
- `MONGODB_URI` - MongoDB Atlas connection
- `JWT_SECRET` - JWT authentication
- `NODE_ENV` - production/development

### Database Migration
Không cần migration. Grade collection sẽ tự động được tạo khi có grade item đầu tiên.

### Frontend Build
```bash
cd frontend
npm install  # Install recharts
npm run build
```

### Render Deployment
- Backend: Đã có grade routes trong server.js
- Frontend: Build đã include Gradebook & StudentGrades
- Push to GitHub → Render auto-deploy

## Known Issues & Limitations

### Current Limitations:
1. **No grade categories**: Tất cả items có weight bằng nhau (chưa có Quiz 30%, Assignment 40%)
2. **No extra credit**: Chưa hỗ trợ điểm cộng vượt maxPoints
3. **No late penalties**: Phải tính thủ công
4. **No grade curves**: Không có auto-scale điểm
5. **Single grader**: Không có peer review hoặc multi-grader

### Planned Enhancements (Phase 1.5):
- [ ] Add grade categories with custom weights
- [ ] Late penalty configuration per assignment
- [ ] Grade override functionality
- [ ] Grade comments/annotations
- [ ] Grade history tracking

## Liên kết với Enhancement Plan

✅ **Priority 1, Feature 1: Gradebook** - HOÀN THÀNH
- Week 1: Backend + Frontend implementation
- Status: Production-ready

➡️ **Next**: Priority 1, Feature 2: Assignment Submission System
- Week 2: Extend Assignment model, add file upload, integrate with Gradebook

## Tài liệu tham khảo

- [Moodle Gradebook Documentation](https://docs.moodle.org/en/Gradebook)
- [Canvas Gradebook Guide](https://community.canvaslms.com/t5/Instructor-Guide/How-do-I-use-the-Gradebook/ta-p/701)
- [Recharts Documentation](https://recharts.org/)
- [Material-UI Table](https://mui.com/material-ui/react-table/)

---

**Tác giả**: GitHub Copilot  
**Ngày tạo**: ${new Date().toLocaleDateString('vi-VN')}  
**Version**: 1.0.0  
**Status**: ✅ Production Ready
