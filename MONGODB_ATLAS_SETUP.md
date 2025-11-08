# Hướng dẫn Setup MongoDB Atlas (FREE)

## Tại sao cần MongoDB Atlas?
Render free tier không hỗ trợ private services cho Docker containers. Vì vậy, chúng ta sẽ sử dụng **MongoDB Atlas Free Tier (512MB)** - hoàn toàn miễn phí và đủ cho LMS demo.

## Các bước setup:

### 1. Tạo tài khoản MongoDB Atlas
- Truy cập: https://cloud.mongodb.com
- Click **"Try Free"** hoặc **"Sign Up"**
- Đăng ký bằng Google/GitHub hoặc email

### 2. Tạo Free Cluster
- Sau khi đăng nhập, click **"Build a Cluster"**
- Chọn **"M0 Sandbox"** (FREE tier - 512MB)
- Chọn Provider: **AWS** hoặc **Google Cloud**
- Chọn Region gần Việt Nam nhất: **Singapore (ap-southeast-1)**
- Cluster Name: **"lms-cluster"** (hoặc tên bạn thích)
- Click **"Create Cluster"** (mất ~3-5 phút)

### 3. Tạo Database User
- Bên trái menu, click **"Database Access"**
- Click **"Add New Database User"**
  - Authentication Method: **Password**
  - Username: **lms_admin** (hoặc tên bạn thích)
  - Password: Click **"Autogenerate Secure Password"** và **LƯU LẠI** password này!
  - Database User Privileges: **Read and write to any database**
- Click **"Add User"**

### 4. Cho phép truy cập từ mọi nơi (Network Access)
- Bên trái menu, click **"Network Access"**
- Click **"Add IP Address"**
- Click **"Allow Access from Anywhere"** (0.0.0.0/0)
- Click **"Confirm"**

⚠️ **Lưu ý:** Trong production thực tế, bạn nên giới hạn IP. Nhưng với Render free tier (IP động), chúng ta cần cho phép tất cả.

### 5. Lấy Connection String
- Bên trái menu, click **"Database"** (hoặc **"Clusters"**)
- Tìm cluster vừa tạo, click nút **"Connect"**
- Chọn **"Connect your application"**
- Driver: **Node.js**
- Version: **4.1 or later**
- Copy **Connection String**, nó sẽ có dạng:
  ```
  mongodb+srv://lms_admin:<password>@lms-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
  ```
- **QUAN TRỌNG:** Thay `<password>` bằng password thực tế bạn đã lưu ở bước 3
- Thêm tên database vào cuối: `/lms_database` trước dấu `?`
  ```
  mongodb+srv://lms_admin:YOUR_PASSWORD@lms-cluster.xxxxx.mongodb.net/lms_database?retryWrites=true&w=majority
  ```

### 6. Cấu hình trong Render
1. Sau khi deploy render.yaml, vào **Render Dashboard**
2. Chọn service **"lms-api"**
3. Vào tab **"Environment"**
4. Tìm biến **MONGODB_URI**
5. Paste connection string vừa tạo ở bước 5
6. Click **"Save Changes"**
7. Service sẽ tự động restart

## Test kết nối local (Optional)
```bash
# Thêm MONGODB_URI vào backend/.env
MONGODB_URI=mongodb+srv://lms_admin:YOUR_PASSWORD@lms-cluster.xxxxx.mongodb.net/lms_database?retryWrites=true&w=majority

# Start backend
cd backend
npm start

# Nếu thấy "Connected to MongoDB" là thành công!
```

## Chi phí
- **MongoDB Atlas M0 (Free Tier):**
  - Storage: 512MB
  - RAM: Shared
  - Miễn phí vĩnh viễn
  - Không cần thẻ tín dụng

- **Render Free Tier:**
  - 750 giờ/tháng (đủ cho 1 service chạy 24/7)
  - Sleep sau 15 phút không hoạt động
  - Miễn phí vĩnh viễn

## Troubleshooting

### Lỗi: "Authentication failed"
→ Kiểm tra lại username và password trong connection string

### Lỗi: "IP not whitelisted"
→ Vào Network Access, thêm 0.0.0.0/0

### Lỗi: "Connection timeout"
→ Cluster có thể đang khởi động (chờ 2-3 phút) hoặc kiểm tra firewall

### Service restart liên tục trên Render
→ MONGODB_URI chưa được set hoặc sai format

## Kết luận
Sau khi hoàn thành các bước trên, bạn sẽ có:
- ✅ MongoDB database miễn phí chạy trên cloud
- ✅ Có thể truy cập từ Render và local
- ✅ Tự động backup bởi MongoDB Atlas
- ✅ Không giới hạn thời gian sử dụng
