# 🚀 HƯỚNG DẪN DEPLOY LMS LÊN RENDER - CHI TIẾT TỪNG BƯỚC

## ✅ Chuẩn bị

- [x] Code đã push lên GitHub: `https://github.com/haihoandaotao/lmsdau`
- [x] MongoDB Atlas đang hoạt động
- [x] Files cấu hình đã sẵn sàng

---

## 📝 BƯỚC 1: Tạo tài khoản Render (Nếu chưa có)

1. Truy cập: **https://render.com**
2. Click **"Get Started"** hoặc **"Sign Up"**
3. Chọn **"Sign up with GitHub"** (khuyến nghị)
4. Authorize Render truy cập GitHub repository của bạn
5. Xác nhận email nếu được yêu cầu

---

## 🔧 BƯỚC 2: Deploy Backend (API Server)

### 2.1. Tạo Web Service cho Backend

1. Vào **Render Dashboard**: https://dashboard.render.com
2. Click nút **"New +"** (góc trên bên phải)
3. Chọn **"Web Service"**

### 2.2. Kết nối GitHub Repository

1. Tại màn hình "Create a new Web Service":
   - Nếu chưa connect: Click **"Connect account"** → Authorize GitHub
   - Nếu đã connect: Tìm repository `haihoandaotao/lmsdau`
2. Click **"Connect"** bên cạnh repository

### 2.3. Cấu hình Backend Service

Điền các thông tin sau:

**Thông tin cơ bản:**
```
Name: lms-dau-backend
Region: Singapore (hoặc gần Việt Nam nhất)
Branch: master
```

**Build settings:**
```
Root Directory: backend
Runtime: Node
Build Command: npm install
Start Command: npm start
```

**Instance Type:**
```
Free (hoặc chọn gói trả phí nếu muốn performance tốt hơn)
```

### 2.4. Thêm Environment Variables

Scroll xuống phần **"Environment Variables"**, click **"Add Environment Variable"**, thêm từng biến sau:

```
Key: NODE_ENV
Value: production
```

```
Key: PORT
Value: 5000
```

```
Key: MONGODB_URI
Value: mongodb+srv://lms_admin:lmsdau123@cluster0.baofaov.mongodb.net/lms_database?retryWrites=true&w=majority
```

```
Key: JWT_SECRET
Value: lms-dau-super-secret-key-2024-production-change-this
```

```
Key: JWT_EXPIRE
Value: 7d
```

```
Key: CLIENT_URL
Value: http://localhost:3000
(Chú ý: Sẽ cập nhật sau khi có frontend URL)
```

### 2.5. Create Service

1. Click **"Create Web Service"** ở cuối trang
2. Đợi Render build và deploy (3-5 phút)
3. Theo dõi logs trong tab **"Logs"**

### 2.6. Verify Backend

Sau khi deploy thành công:

1. Copy URL từ top page (VD: `https://lms-dau-backend.onrender.com`)
2. Mở trình duyệt, truy cập: `https://lms-dau-backend.onrender.com/health`
3. Kết quả mong đợi:
```json
{
  "status": "OK",
  "database": "Connected",
  "timestamp": "2024-11-10T...",
  "environment": "production"
}
```

**✅ Backend deployment hoàn tất!**

**Lưu Backend URL**: `https://lms-dau-backend.onrender.com`

---

## 🎨 BƯỚC 3: Deploy Frontend (React App)

### 3.1. Tạo Static Site cho Frontend

1. Vào **Render Dashboard**: https://dashboard.render.com
2. Click **"New +"** → **"Static Site"**

### 3.2. Kết nối Repository

1. Chọn repository `haihoandaotao/lmsdau`
2. Click **"Connect"**

### 3.3. Cấu hình Frontend Service

**Thông tin cơ bản:**
```
Name: lms-dau-frontend
Region: Singapore
Branch: master
```

**Build settings:**
```
Root Directory: frontend
Build Command: npm install && npm run build
Publish Directory: build
```

### 3.4. Thêm Environment Variable

Click **"Advanced"** → **"Add Environment Variable"**:

```
Key: REACT_APP_API_URL
Value: https://lms-dau-backend.onrender.com/api
```

**(Thay `https://lms-dau-backend.onrender.com` bằng Backend URL thực tế từ bước 2.6)**

### 3.5. Create Static Site

1. Click **"Create Static Site"**
2. Đợi build (5-10 phút, React build lâu hơn backend)
3. Theo dõi logs để check progress

### 3.6. Verify Frontend

Sau khi build xong:

1. Copy URL (VD: `https://lms-dau-frontend.onrender.com`)
2. Mở trình duyệt, truy cập URL
3. Kiểm tra:
   - Trang Login hiển thị đúng
   - UI Material-UI render ok
   - Không có lỗi console (F12)

**✅ Frontend deployment hoàn tất!**

**Lưu Frontend URL**: `https://lms-dau-frontend.onrender.com`

---

## 🔄 BƯỚC 4: Cập nhật CORS (Quan trọng!)

Bây giờ cần cho phép Backend nhận request từ Frontend

### 4.1. Update Backend Environment Variable

1. Vào **Backend Service** (`lms-dau-backend`)
2. Click tab **"Environment"**
3. Tìm biến **CLIENT_URL**, click **Edit**
4. Thay đổi value thành Frontend URL:
```
https://lms-dau-frontend.onrender.com
```
5. Click **"Save Changes"**

### 4.2. Redeploy Backend

1. Vào tab **"Manual Deploy"**
2. Click **"Clear build cache & deploy"**
3. Đợi redeploy (1-2 phút)

---

## 🧪 BƯỚC 5: Test Hệ thống

### 5.1. Test Login

1. Mở: `https://lms-dau-frontend.onrender.com`
2. Đăng nhập với:
   ```
   Email: admin@dau.edu.vn
   Password: admin123
   ```
3. Kiểm tra:
   - Login thành công
   - Redirect về Dashboard
   - Không có CORS error (F12 Console)

### 5.2. Test API Connection

1. Mở F12 → **Network tab**
2. Login lại
3. Kiểm tra request:
   - POST request đến: `https://lms-dau-backend.onrender.com/api/auth/login`
   - Status: **200 OK**
   - Response có token và user data

### 5.3. Test Features

Thử các chức năng:
- ✅ View Dashboard
- ✅ View Courses
- ✅ View Student Curriculum (/curriculum)
- ✅ View Course Detail
- ✅ Admin → Quản lý Ngành đào tạo

---

## 🚨 TROUBLESHOOTING

### Issue 1: Backend deploy fail - "Build failed"

**Nguyên nhân:** Missing dependencies hoặc build script error

**Giải pháp:**
1. Check logs trong Render
2. Verify `package.json` có đúng dependencies
3. Test local: `cd backend && npm install && npm start`

### Issue 2: Frontend build fail - "npm ERR!"

**Nguyên nhân:** Dependency conflicts hoặc out of memory

**Giải pháp:**
1. Check logs
2. Local test: `cd frontend && npm run build`
3. Upgrade Render plan nếu cần (Free tier có giới hạn RAM)

### Issue 3: CORS Error - "blocked by CORS policy"

**Nguyên nhân:** Backend chưa allow frontend domain

**Giải pháp:**
1. Backend Environment → CLIENT_URL = Frontend URL
2. Redeploy backend
3. Hard refresh frontend (Ctrl + F5)

### Issue 4: 502 Bad Gateway

**Nguyên nhân:** Backend sleep (Free tier sleep sau 15 phút idle)

**Giải pháp:**
1. Đợi 30-60s backend wake up
2. Refresh page
3. Hoặc upgrade plan để tránh sleep

### Issue 5: Database connection timeout

**Nguyên nhân:** MongoDB Atlas IP whitelist

**Giải pháp:**
1. MongoDB Atlas → Network Access
2. Add IP: `0.0.0.0/0` (allow all)
3. Save
4. Redeploy backend

### Issue 6: Login fails with 401

**Nguyên nhân:** JWT_SECRET khác local, hoặc database chưa có user

**Giải pháp:**
1. Verify MONGODB_URI đúng
2. Test API: `curl https://lms-dau-backend.onrender.com/health`
3. Seed data nếu cần (xem BƯỚC 6)

---

## 🌱 BƯỚC 6: Seed Data (Nếu database trống)

### Option 1: Seed qua Local Script

```powershell
cd E:\PROJECT\lms

# Set production database
$env:MONGODB_URI="mongodb+srv://lms_admin:lmsdau123@cluster0.baofaov.mongodb.net/lms_database"

# Seed admin
node backend/seeders/create-admin.js

# Seed majors & curriculum
node backend/seeders/seed-majors-curriculum.js

# Seed full CNTT curriculum
node backend/seeders/seed-full-curriculum-cntt.js
```

### Option 2: Seed qua API (nếu có endpoint)

```bash
# Gọi API seed
curl -X POST https://lms-dau-backend.onrender.com/api/seed/init
```

### Option 3: Import từ MongoDB Compass

1. Kết nối MongoDB Compass với Atlas
2. Select database: `lms_database`
3. Import collections từ backup/export

---

## 📊 BƯỚC 7: Monitoring & Logs

### 7.1. View Logs

**Backend:**
- Dashboard → lms-dau-backend → **Logs tab**
- Real-time logs hiển thị requests, errors

**Frontend:**
- Dashboard → lms-dau-frontend → **Logs tab**
- Build logs và deployment status

### 7.2. Check Metrics

- Click tab **"Metrics"**
- Xem: CPU, Memory, Request count, Response time

### 7.3. Setup Alerts (Optional)

1. Service Settings → **Notifications**
2. Add email hoặc Slack webhook
3. Nhận cảnh báo khi deploy fail hoặc service down

---

## 🎉 DEPLOYMENT COMPLETE!

### 🌐 Your Live URLs:

**Frontend (Student/Admin):**
```
https://lms-dau-frontend.onrender.com
```

**Backend (API):**
```
https://lms-dau-backend.onrender.com
```

**Health Check:**
```
https://lms-dau-backend.onrender.com/health
```

### 👥 Test Accounts:

**Admin:**
```
Email: admin@dau.edu.vn
Password: admin123
```

**Student:**
```
Email: student@example.com
Password: password123
```

**Teacher:**
```
Email: teacher@example.com
Password: password123
```

---

## 🚀 NEXT STEPS

### Immediate:
- [ ] Test all features
- [ ] Verify student curriculum page
- [ ] Test course enrollment
- [ ] Check quiz functionality

### Short-term:
- [ ] Setup custom domain (lms.dau.edu.vn)
- [ ] Add SSL certificate (free on Render)
- [ ] Setup email service (SendGrid/Mailgun)
- [ ] Add error monitoring (Sentry)

### Long-term:
- [ ] Upgrade to paid plan (no sleep, better performance)
- [ ] Setup CI/CD pipeline
- [ ] Add automated testing
- [ ] Setup staging environment

---

## 💰 RENDER PRICING

### Free Tier:
- ✅ Backend: Spins down after 15 min idle (cold start ~1 min)
- ✅ Frontend: Always available, no sleep
- ✅ 750 hours/month
- ✅ Shared resources

### Starter Plan ($7/month):
- ✅ No sleep
- ✅ Dedicated resources
- ✅ Better performance

### Standard Plan ($25/month):
- ✅ Priority support
- ✅ More resources
- ✅ Autoscaling

---

## 📞 SUPPORT & RESOURCES

**Render Documentation:**
https://render.com/docs

**MongoDB Atlas:**
https://www.mongodb.com/docs/atlas

**GitHub Repository:**
https://github.com/haihoandaotao/lmsdau

**Issues:**
https://github.com/haihoandaotao/lmsdau/issues

---

## 🎓 Congratulations!

Hệ thống LMS của bạn đã được deploy thành công lên Render! 🎊

Giờ đây sinh viên và giảng viên có thể truy cập LMS từ bất kỳ đâu với internet.

**Happy Learning! 📚**
