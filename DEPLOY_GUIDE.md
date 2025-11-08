# 🚀 HƯỚNG DẪN DEPLOY LMS TRÊN RENDER

## ✅ Điều kiện tiên quyết
- [x] Code đã push lên GitHub (repo: haihoandaotao/lmsdau)
- [x] MongoDB Atlas đã setup (connection string đã có)
- [x] Tài khoản Render.com (miễn phí)

---

## 📋 CÁC BƯỚC DEPLOY

### BƯỚC 1: VÀO RENDER DASHBOARD
1. Mở trình duyệt, truy cập: **https://dashboard.render.com**
2. Đăng nhập (nếu chưa đăng nhập)

---

### BƯỚC 2: TẠO WEB SERVICE MỚI
1. Click nút **"New +"** (góc trên bên phải màn hình)
2. Chọn **"Web Service"** từ menu dropdown

---

### BƯỚC 3: KẾT NỐI GITHUB REPO
1. Chọn **"Build and deploy from a Git repository"**
2. Click **"Next"**
3. Tìm repo: **haihoandaotao/lmsdau** (hoặc click "Configure Account" để thêm repo nếu chưa thấy)
4. Click nút **"Connect"** bên cạnh repo

---

### BƯỚC 4: CÂU HÌNH SERVICE

Điền các thông tin sau:

| Field | Value |
|-------|-------|
| **Name** | `lms-api` |
| **Region** | `Singapore` (hoặc `Oregon` nếu gần hơn) |
| **Branch** | `master` |
| **Root Directory** | _(để trống)_ |
| **Runtime** | `Node` |
| **Build Command** | `npm install && cd frontend && npm install && npm run build && cd ..` |
| **Start Command** | `npm start` |
| **Instance Type** | `Free` |

> ⚠️ **CHÚ Ý**: Build Command phải nhập chính xác như trên!

---

### BƯỚC 5: THÊM ENVIRONMENT VARIABLES

Cuộn xuống, tìm **"Environment Variables"**, click **"Add Environment Variable"**

Thêm **4 biến** sau:

#### 1. NODE_ENV
```
Key:   NODE_ENV
Value: production
```

#### 2. PORT
```
Key:   PORT
Value: 10000
```

#### 3. MONGODB_URI
```
Key:   MONGODB_URI
Value: mongodb+srv://lms_admin:lmsdau123@cluster0.baofaov.mongodb.net/lms_database?retryWrites=true&w=majority
```

#### 4. JWT_SECRET
```
Key:   JWT_SECRET
Value: (Click nút "Generate" để tự động tạo)
```

---

### BƯỚC 6: DEPLOY

1. Cuộn xuống cuối cùng
2. Click nút **"Create Web Service"** (màu xanh lá)
3. Đợi **5-10 phút** để Render build và deploy

**Theo dõi quá trình:**
- Tab **"Logs"** sẽ hiện thị quá trình build
- Bạn sẽ thấy:
  - `Installing dependencies...`
  - `Building frontend...`
  - `Starting server...`
  - `✅ MongoDB Connected`
  - `🚀 Server running on port 10000`

---

### BƯỚC 7: KIỂM TRA

Sau khi deploy thành công:

✅ **Status** sẽ chuyển thành **"Live"** (màu xanh lá)

✅ **URL** sẽ hiển thị ở trên cùng (vd: `https://lms-api-xxx.onrender.com`)

✅ **Click vào URL** → Trình duyệt mở trang **Login** của LMS

✅ **Kiểm tra Logs** → Tìm dòng `"✅ Connected to MongoDB"`

---

## 🎯 TEST HỆ THỐNG

### 1. Tạo tài khoản Admin
- Vào trang Login
- Click "Register"
- Tạo tài khoản đầu tiên (sẽ tự động là Admin)

### 2. Kiểm tra các chức năng
- ✅ Login/Logout
- ✅ Tạo khóa học
- ✅ Upload file assignments
- ✅ Forum discussion
- ✅ Real-time notifications
- ✅ Progress tracking

---

## 🔧 TROUBLESHOOTING

### Lỗi: "Application failed to respond"
**Nguyên nhân**: MongoDB connection string sai hoặc MongoDB Atlas chưa allow IP

**Giải pháp**:
1. Kiểm tra lại MONGODB_URI trong Environment Variables
2. Vào MongoDB Atlas → Network Access → Allow access from anywhere (0.0.0.0/0)

---

### Lỗi: "Build failed"
**Nguyên nhân**: Build command sai hoặc thiếu dependencies

**Giải pháp**:
1. Kiểm tra lại Build Command
2. Xem Logs để tìm lỗi cụ thể
3. Thử Manual Deploy lại

---

### Service bị "Sleeping"
**Nguyên nhân**: Free tier của Render sẽ sleep sau 15 phút không hoạt động

**Giải pháp**:
- Đợi 15-30 giây, service sẽ tự động wake up
- Hoặc upgrade lên paid plan để luôn active

---

## 📊 THÔNG TIN FREE TIER

### Render Free Tier
- ✅ 750 giờ/tháng (đủ cho 1 service 24/7)
- ✅ Sleep sau 15 phút idle
- ✅ Wake up time: 15-30 giây
- ✅ Miễn phí vĩnh viễn

### MongoDB Atlas Free Tier
- ✅ 512MB storage
- ✅ Shared RAM
- ✅ Miễn phí vĩnh viễn
- ✅ Không cần thẻ tín dụng

---

## 🎉 HOÀN TẤT!

Sau khi hoàn thành tất cả các bước trên, bạn đã có:

✅ **LMS System** chạy trên cloud hoàn toàn miễn phí
✅ **Database** MongoDB Atlas cloud
✅ **Auto-deploy** khi push code lên GitHub
✅ **SSL/HTTPS** tự động từ Render

**URL cuối cùng**: `https://lms-api-[your-id].onrender.com`

---

## 📞 HỖ TRỢ

Nếu gặp vấn đề, hãy:
1. Kiểm tra **Logs** trên Render Dashboard
2. Kiểm tra **Environment Variables** đã đúng chưa
3. Test MongoDB connection string local trước

**Good luck!** 🚀
