# LMS Management Enhancement Plan
## Phân tích Moodle & Canvas - Kế hoạch nâng cấp LMS-DAU

### 📊 HIỆN TRẠNG
**Có sẵn:**
- ✅ Modules (Sections/Weeks)
- ✅ Video items với YouTube
- ✅ Reading materials
- ✅ Basic progress tracking
- ✅ Enrollment system
- ✅ Sequential unlock

**Thiếu so với Moodle/Canvas:**
- ❌ Syllabus/Course outline
- ❌ Gradebook (Sổ điểm)
- ❌ Rich content editor (WYSIWYG)
- ❌ File management & downloads
- ❌ Discussion forums per module
- ❌ Quiz builder với câu hỏi tự động chấm
- ❌ Assignment submission & grading
- ❌ Due dates & calendar
- ❌ Attendance tracking
- ❌ Peer review system
- ❌ Groups/Teams
- ❌ Announcements/News
- ❌ Email notifications
- ❌ Bulk operations
- ❌ Course cloning/backup

---

## 🎯 PRIORITY 1: CORE FEATURES (Tuần 1-2)

### 1. Course Settings & Syllabus
**Moodle equivalent:** Course settings, Course format
**Canvas equivalent:** Course Details, Syllabus

```javascript
// backend/models/Course.js - Thêm fields
{
  // Existing fields...
  
  // New fields
  syllabus: String,
  courseFormat: { 
    type: String, 
    enum: ['topics', 'weekly', 'social'], 
    default: 'topics' 
  },
  startDate: Date,
  endDate: Date,
  courseImage: String,
  prerequisiteCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  maxStudents: Number,
  isPublished: { type: Boolean, default: false },
  selfEnrollmentEnabled: { type: Boolean, default: true },
  
  // Grading
  gradingScheme: {
    type: String,
    enum: ['percentage', 'letter', 'points'],
    default: 'percentage'
  },
  passingGrade: { type: Number, default: 50 },
  
  // Settings
  showGradesToStudents: { type: Boolean, default: true },
  allowLateSubmissions: { type: Boolean, default: true },
  latePenalty: { type: Number, default: 10 } // % per day
}
```

**Frontend Component:** `CourseSettings.js`
- Tab navigation: General, Syllabus, Grading, Access
- Rich text editor (TinyMCE hoặc Quill)
- Image upload cho course banner
- Date pickers cho start/end

---

### 2. Gradebook System
**Moodle equivalent:** Gradebook
**Canvas equivalent:** Grades

```javascript
// backend/models/Grade.js
const gradeSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  
  items: [{
    itemType: { type: String, enum: ['assignment', 'quiz', 'discussion', 'attendance'] },
    itemId: mongoose.Schema.Types.ObjectId,
    itemName: String,
    maxPoints: Number,
    earnedPoints: Number,
    percentage: Number,
    submittedAt: Date,
    gradedAt: Date,
    gradedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    feedback: String,
    lateSubmission: Boolean,
    latePenaltyApplied: Number
  }],
  
  // Tính toán tổng
  totalPoints: Number,
  totalPossible: Number,
  finalGrade: Number,
  letterGrade: String,
  status: { type: String, enum: ['passing', 'failing', 'incomplete'], default: 'incomplete' },
  
  lastCalculated: Date
});

// Methods
gradeSchema.methods.calculateFinalGrade = function() {
  // Logic tính điểm trung bình có trọng số
};
```

**Frontend Component:** `Gradebook.js`
- Table view với sort/filter
- Export to Excel
- Grade distribution chart
- Individual student detail view
- Bulk grading interface

---

### 3. Assignment Submission System
**Moodle equivalent:** Assignment activity
**Canvas equivalent:** Assignments

```javascript
// backend/models/Assignment.js - Nâng cấp
{
  // Existing fields...
  
  // New fields
  submissionTypes: [{
    type: String,
    enum: ['online_text', 'file_upload', 'url', 'media_recording']
  }],
  allowedFileTypes: [String], // ['.pdf', '.doc', '.docx']
  maxFileSize: Number, // MB
  maxSubmissions: { type: Number, default: 1 },
  
  dueDate: Date,
  availableFrom: Date,
  availableUntil: Date,
  lateSubmissionAllowed: Boolean,
  
  // Grading
  maxPoints: Number,
  rubric: [{
    criterion: String,
    description: String,
    points: Number
  }],
  peerReviewEnabled: Boolean,
  peerReviewCount: Number,
  
  // Settings
  groupAssignment: Boolean,
  requireGradeToViewFeedback: Boolean
}

// backend/models/Submission.js
const submissionSchema = new mongoose.Schema({
  assignment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  submittedAt: Date,
  isLate: Boolean,
  attemptNumber: Number,
  
  // Content
  textContent: String,
  files: [{
    filename: String,
    originalName: String,
    url: String,
    size: Number,
    mimeType: String
  }],
  urlSubmission: String,
  
  // Grading
  grade: Number,
  feedback: String,
  gradedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  gradedAt: Date,
  rubricScores: [{
    criterionId: String,
    score: Number,
    comment: String
  }],
  
  status: { 
    type: String, 
    enum: ['draft', 'submitted', 'graded', 'returned'], 
    default: 'draft' 
  }
});
```

**Frontend Components:**
- `AssignmentSubmit.js` - Student submission interface
- `AssignmentGrading.js` - Teacher grading interface với rubric
- `SubmissionTimeline.js` - Version history

---

### 4. Quiz Builder & Auto-Grading
**Moodle equivalent:** Quiz activity
**Canvas equivalent:** Quizzes

```javascript
// backend/models/Quiz.js
const quizSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  title: String,
  description: String,
  instructions: String,
  
  // Settings
  timeLimit: Number, // minutes
  attempts: { type: Number, default: 1 },
  shuffleQuestions: Boolean,
  showCorrectAnswers: { type: String, enum: ['never', 'after_submit', 'after_due'], default: 'after_submit' },
  
  dueDate: Date,
  availableFrom: Date,
  availableUntil: Date,
  
  // Questions
  questions: [{
    type: { 
      type: String, 
      enum: ['multiple_choice', 'true_false', 'short_answer', 'essay', 'matching', 'fill_blank'] 
    },
    question: String,
    points: Number,
    
    // For multiple choice
    choices: [{
      text: String,
      isCorrect: Boolean
    }],
    
    // For short answer
    correctAnswers: [String],
    caseSensitive: Boolean,
    
    // For essay
    maxWords: Number,
    
    // For matching
    pairs: [{
      left: String,
      right: String
    }],
    
    explanation: String,
    order: Number
  }],
  
  totalPoints: Number,
  passingScore: Number
});

// backend/models/QuizAttempt.js
const quizAttemptSchema = new mongoose.Schema({
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  attemptNumber: Number,
  
  startedAt: Date,
  submittedAt: Date,
  timeSpent: Number, // seconds
  
  answers: [{
    questionId: String,
    answer: mongoose.Schema.Types.Mixed, // String, Array, or Object
    isCorrect: Boolean,
    points: Number,
    feedback: String
  }],
  
  score: Number,
  percentage: Number,
  status: { type: String, enum: ['in_progress', 'submitted', 'graded'] }
});
```

**Frontend Components:**
- `QuizBuilder.js` - Drag & drop question builder
- `QuizTaker.js` - Student quiz interface với timer
- `QuizResults.js` - Results với review mode

---

## 🎯 PRIORITY 2: ENGAGEMENT FEATURES (Tuần 3-4)

### 5. Discussion Forums per Module
**Moodle equivalent:** Forum activity
**Canvas equivalent:** Discussions

```javascript
// backend/models/Discussion.js
const discussionSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  module: { type: mongoose.Schema.Types.ObjectId, ref: 'Module' },
  
  title: String,
  description: String,
  type: { type: String, enum: ['general', 'qa', 'announcement'], default: 'general' },
  
  // Settings
  allowStudentPosts: { type: Boolean, default: true },
  requirePostBeforeView: Boolean,
  isGraded: Boolean,
  maxPoints: Number,
  
  // Threading
  posts: [{
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: String,
    createdAt: Date,
    editedAt: Date,
    
    // Replies
    parentPost: mongoose.Schema.Types.ObjectId,
    
    // Engagement
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isPinned: Boolean,
    isResolved: Boolean, // For Q&A
    
    // Attachments
    attachments: [{
      filename: String,
      url: String
    }]
  }]
});
```

**Frontend Component:** `DiscussionBoard.js`
- Nested threading
- Rich text editor
- File attachments
- Search & filter

---

### 6. Announcements & Notifications
**Moodle equivalent:** Announcements forum
**Canvas equivalent:** Announcements

```javascript
// backend/models/Announcement.js
const announcementSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  title: String,
  content: String,
  
  // Delivery
  publishAt: Date,
  isPinned: Boolean,
  sendEmail: Boolean,
  sendPush: Boolean,
  
  // Targeting
  audience: { 
    type: String, 
    enum: ['all', 'students', 'teachers', 'groups'], 
    default: 'all' 
  },
  groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
  
  // Engagement
  readBy: [{ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    readAt: Date 
  }]
});
```

**Frontend Component:** `AnnouncementsFeed.js`
- Timeline view
- Mark as read
- Email preview

---

### 7. Calendar & Due Dates
**Moodle equivalent:** Calendar block
**Canvas equivalent:** Calendar

```javascript
// backend/models/CalendarEvent.js
const calendarEventSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  
  title: String,
  description: String,
  eventType: { 
    type: String, 
    enum: ['assignment', 'quiz', 'lecture', 'exam', 'holiday', 'custom'] 
  },
  
  startDate: Date,
  endDate: Date,
  allDay: Boolean,
  
  // Links
  linkedItem: {
    itemType: String,
    itemId: mongoose.Schema.Types.ObjectId
  },
  
  location: String,
  color: String
});
```

**Frontend Component:** `CourseCalendar.js`
- Month/Week/Day views
- Sync with Google Calendar
- Reminders

---

## 🎯 PRIORITY 3: ADVANCED FEATURES (Tuần 5-6)

### 8. File Manager
**Moodle equivalent:** Files
**Canvas equivalent:** Files

```javascript
// backend/models/CourseFile.js
const courseFileSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  filename: String,
  originalName: String,
  size: Number,
  mimeType: String,
  
  // Storage
  storageProvider: { type: String, enum: ['local', 's3', 'cloudinary'] },
  url: String,
  path: String,
  
  // Organization
  folder: String,
  tags: [String],
  
  // Access
  visibility: { type: String, enum: ['public', 'enrolled', 'teachers'], default: 'enrolled' },
  
  // Metadata
  uploadedAt: Date,
  downloadCount: Number,
  fileHash: String // For duplicate detection
});
```

**Frontend Component:** `FileManager.js`
- Folder tree navigation
- Drag & drop upload
- Bulk download as ZIP
- Preview PDFs/images

---

### 9. Groups & Collaborative Work
**Moodle equivalent:** Groups
**Canvas equivalent:** Groups

```javascript
// backend/models/Group.js
const groupSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  name: String,
  description: String,
  
  members: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: ['member', 'leader'] }
  }],
  
  maxMembers: Number,
  selfEnrollment: Boolean,
  
  // Shared resources
  groupDiscussion: { type: mongoose.Schema.Types.ObjectId, ref: 'Discussion' },
  groupFiles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CourseFile' }]
});
```

---

### 10. Attendance Tracking
**Moodle equivalent:** Attendance plugin
**Canvas equivalent:** Roll Call Attendance

```javascript
// backend/models/Attendance.js
const attendanceSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  module: { type: mongoose.Schema.Types.ObjectId, ref: 'Module' },
  
  date: Date,
  title: String,
  
  records: [{
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['present', 'absent', 'late', 'excused'] },
    note: String,
    markedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    markedAt: Date
  }],
  
  // Auto-tracking
  videoWatchTime: Number, // If based on video completion
  activityThreshold: Number // Minimum activity to count as present
});
```

---

## 🎯 PRIORITY 4: ANALYTICS & REPORTING (Tuần 7-8)

### 11. Teacher Analytics Dashboard
**Canvas equivalent:** Analytics, Insights

```javascript
// backend/controllers/analyticsController.js
exports.getCourseAnalytics = async (req, res) => {
  const { courseId } = req.params;
  
  // 1. Enrollment trends
  // 2. Average grades
  // 3. Assignment completion rates
  // 4. Video watch time
  // 5. Discussion participation
  // 6. At-risk students (< 60% attendance + low grades)
  // 7. Module completion funnel
};

exports.getStudentAnalytics = async (req, res) => {
  // Individual student dashboard
  // Time spent per module
  // Grade progression
  // Comparison to class average
};
```

**Frontend Component:** `TeacherDashboard.js`
- Charts với recharts/chart.js
- Filters: Date range, student groups
- Export reports as PDF

---

### 12. Student Progress Reports
**Moodle equivalent:** Completion tracking
**Canvas equivalent:** Progress Reports

```javascript
// backend/models/Progress.js - Enhanced
{
  // Existing fields...
  
  // New tracking
  modulesCompleted: [{
    moduleId: mongoose.Schema.Types.ObjectId,
    completedAt: Date,
    timeSpent: Number,
    score: Number
  }],
  
  // Badges/Achievements
  badges: [{
    type: String, // 'early_bird', 'perfect_score', 'helpful_peer'
    earnedAt: Date,
    description: String
  }],
  
  // Predictive
  riskLevel: { type: String, enum: ['low', 'medium', 'high'] },
  projectedGrade: Number
}
```

---

## 📋 IMPLEMENTATION ROADMAP

### Phase 1 (Tuần 1-2): Foundation
- [ ] Course Settings & Syllabus page
- [ ] Gradebook system (backend + frontend)
- [ ] Assignment submission with file upload
- [ ] Quiz builder basic (MCQ + True/False)

### Phase 2 (Tuần 3-4): Engagement
- [ ] Discussion forums per module
- [ ] Announcements system
- [ ] Calendar integration
- [ ] Email notifications

### Phase 3 (Tuần 5-6): Advanced
- [ ] File manager với folder structure
- [ ] Groups & teams
- [ ] Attendance tracking
- [ ] Peer review system

### Phase 4 (Tuần 7-8): Analytics
- [ ] Teacher analytics dashboard
- [ ] Student progress reports
- [ ] At-risk student detection
- [ ] Export/import tools

---

## 🛠️ TECHNICAL STACK ADDITIONS

### Backend
- **File Storage:** `multer` + AWS S3 / Cloudinary
- **Email:** `nodemailer` / SendGrid
- **PDF Generation:** `puppeteer` / `pdfkit`
- **Excel Export:** `exceljs`
- **Rich Text:** Store HTML/Markdown
- **Cron Jobs:** `node-cron` for scheduled tasks

### Frontend
- **Rich Text Editor:** `react-quill` hoặc `tinymce-react`
- **Charts:** `recharts` hoặc `chart.js`
- **Calendar:** `react-big-calendar` hoặc `fullcalendar`
- **File Upload:** `react-dropzone`
- **PDF Viewer:** `react-pdf`
- **Drag & Drop:** `react-beautiful-dnd`

---

## 🎨 UI/UX IMPROVEMENTS

### Navigation Enhancements
```
Course Menu:
├── Home (Syllabus)
├── Modules (Current)
├── Assignments
├── Quizzes
├── Discussions
├── Grades
├── Files
├── Calendar
├── Groups
└── Settings (Teacher only)
```

### Teacher Sidebar
- Quick stats cards
- Recent activity feed
- Pending tasks (grading queue)
- Student alerts

### Student Dashboard
- Progress ring/bar
- Upcoming deadlines
- Recent grades
- Achievements/badges

---

## 🚀 QUICK WINS (Có thể làm ngay)

### 1. Course Syllabus Tab
```javascript
// Add to CourseDetail.js
<Tabs value={tabValue}>
  <Tab label="Tổng quan" />
  <Tab label="Giáo trình" /> {/* New */}
  <Tab label="Bài giảng" />
  <Tab label="Bài tập" />
</Tabs>

{tabValue === 1 && (
  <Box sx={{ p: 3 }}>
    <Typography variant="h5">Giáo trình khóa học</Typography>
    <Divider sx={{ my: 2 }} />
    <div dangerouslySetInnerHTML={{ __html: course.syllabus }} />
  </Box>
)}
```

### 2. Due Date Badges
```javascript
// Add to ModuleManagement items
<Chip 
  icon={<CalendarIcon />}
  label={`Due: ${formatDate(item.dueDate)}`}
  color={isPastDue ? 'error' : 'default'}
  size="small"
/>
```

### 3. Grade Display
```javascript
// Add to CourseViewer
<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
  <Typography variant="body2">Điểm hiện tại:</Typography>
  <Chip 
    label={`${currentGrade}%`} 
    color={currentGrade >= 80 ? 'success' : currentGrade >= 60 ? 'warning' : 'error'}
  />
</Box>
```

---

## 📊 DATABASE MIGRATION PLAN

```javascript
// backend/migrations/add-course-features.js
module.exports = {
  async up(db) {
    // Add new fields to Course collection
    await db.collection('courses').updateMany({}, {
      $set: {
        syllabus: '',
        courseFormat: 'topics',
        isPublished: true,
        gradingScheme: 'percentage',
        passingGrade: 50
      }
    });
    
    // Create indexes
    await db.collection('grades').createIndex({ student: 1, course: 1 });
    await db.collection('submissions').createIndex({ assignment: 1, student: 1 });
  }
};
```

---

## ✅ CHECKLIST VALIDATION

So sánh với **Moodle Core Features:**
- [x] Courses & Categories
- [x] Modules/Topics
- [ ] Assignments (basic only)
- [ ] Quizzes (missing)
- [ ] Forums (missing per module)
- [ ] Gradebook (missing)
- [ ] Calendar (missing)
- [ ] File management (basic only)
- [ ] Groups (missing)
- [ ] Messaging (missing)

So sánh với **Canvas Core Features:**
- [x] Courses
- [x] Modules
- [ ] Assignments (submission missing)
- [ ] Quizzes (missing)
- [ ] Discussions (basic forum only)
- [ ] Grades (missing)
- [ ] Calendar (missing)
- [ ] Files (basic only)
- [ ] Rubrics (missing)
- [ ] SpeedGrader (missing)

**Current Coverage:** ~40%  
**Target Coverage:** 85%+ (enterprise-ready LMS)

---

## 💡 RECOMMENDATIONS

### Start with High-Impact, Low-Effort:
1. **Week 1:** Gradebook system - Điểm số là core feature
2. **Week 2:** Assignment submission - Students cần nộp bài
3. **Week 3:** Quiz auto-grading - Giảm workload cho GV
4. **Week 4:** Calendar & due dates - Tổ chức tốt hơn

### Defer to Phase 2:
- Groups (ít khóa dùng)
- Peer review (phức tạp)
- Advanced analytics (cần data lớn)

---

## 📞 NEXT STEPS

1. **Review plan này với stakeholders**
2. **Chọn Priority 1 features để implement**
3. **Setup file storage (S3/Cloudinary)**
4. **Design database schema cho Grades & Submissions**
5. **Create wireframes cho Gradebook UI**

Bạn muốn bắt đầu với feature nào trước? Tôi recommend **Gradebook** vì nó là foundation cho Assignment grading và Quiz scoring!
