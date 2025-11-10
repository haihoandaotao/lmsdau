# LMS-DAU Deployment Guide - Render

## 📋 Prerequisites

1. **GitHub Repository**: Code đã push lên GitHub
2. **Render Account**: Đăng ký tại https://render.com
3. **MongoDB Atlas**: Database cloud (đã có)

---

## 🚀 BƯỚC 1: Chuẩn bị Backend

### 1.1. Tạo file render.yaml (Root của project)

```yaml
services:
  # Backend Service
  - type: web
    name: lms-dau-backend
    env: node
    region: singapore
    buildCommand: cd backend && npm install
    startCommand: cd backend && npm start
    envVars:
      - key: MONGODB_URI
        sync: false
      - key: JWT_SECRET
        generateValue: true
      - key: JWT_EXPIRE
        value: 7d
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 5000
      - key: CLIENT_URL
        sync: false

  # Frontend Service  
  - type: web
    name: lms-dau-frontend
    env: static
    region: singapore
    buildCommand: cd frontend && npm install && npm run build
    staticPublishPath: frontend/build
    envVars:
      - key: REACT_APP_API_URL
        sync: false
```

### 1.2. Cập nhật backend/package.json

Thêm vào `scripts`:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### 1.3. Cập nhật backend/server.js

Thêm vào đầu file để handle production:

```javascript
// Production optimizations
if (process.env.NODE_ENV === 'production') {
  app.enable('trust proxy');
}

// CORS for production
app.use(cors({
  origin: process.env.CLIENT_URL?.split(',') || '*',
  credentials: true
}));
```

---

## 🚀 BƯỚC 2: Chuẩn bị Frontend

### 2.1. Cập nhật frontend/package.json

```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### 2.2. Tạo frontend/.env.production

```env
REACT_APP_API_URL=https://lms-dau-backend.onrender.com
```

### 2.3. Cập nhật frontend/src/utils/api.js

```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json'
  }
});
```

---

## 🚀 BƯỚC 3: Deploy trên Render

### 3.1. Deploy Backend

1. **Vào Render Dashboard**: https://dashboard.render.com
2. **Click "New +"** → **Web Service**
3. **Connect GitHub repository**: `haihoandaotao/lmsdau`
4. **Cấu hình:**
   - Name: `lms-dau-backend`
   - Region: `Singapore`
   - Branch: `master`
   - Root Directory: `backend`
   - Runtime: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Instance Type: `Free`

5. **Environment Variables:**
   ```
   MONGODB_URI = mongodb+srv://lms_admin:lmsdau123@cluster0.baofaov.mongodb.net/lms_database?retryWrites=true&w=majority
   JWT_SECRET = your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE = 7d
   NODE_ENV = production
   PORT = 5000
   CLIENT_URL = https://lms-dau-frontend.onrender.com
   ```

6. **Click "Create Web Service"**

7. **Đợi deploy** (3-5 phút)

8. **Lấy URL**: `https://lms-dau-backend.onrender.com`

### 3.2. Deploy Frontend

1. **Click "New +"** → **Static Site**
2. **Connect GitHub repository**: `haihoandaotao/lmsdau`
3. **Cấu hình:**
   - Name: `lms-dau-frontend`
   - Region: `Singapore`
   - Branch: `master`
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `build`

4. **Environment Variables:**
   ```
   REACT_APP_API_URL = https://lms-dau-backend.onrender.com
   ```

5. **Click "Create Static Site"**

6. **Đợi build** (5-10 phút)

7. **Lấy URL**: `https://lms-dau-frontend.onrender.com`

---

## 🚀 BƯỚC 4: Cập nhật CORS

### 4.1. Cập nhật backend Environment Variables

Vào **Backend Service** → **Environment** → Sửa:

```
CLIENT_URL = https://lms-dau-frontend.onrender.com
```

### 4.2. Restart Backend

Click **Manual Deploy** → **Clear build cache & deploy**

---

## 🚀 BƯỚC 5: Test Hệ thống

### 5.1. Test Backend API

Mở: `https://lms-dau-backend.onrender.com/health`

Kết quả mong đợi:
```json
{
  "status": "OK",
  "database": "Connected"
}
```

### 5.2. Test Frontend

Mở: `https://lms-dau-frontend.onrender.com`

Thử login với:
- Email: `admin@dau.edu.vn`
- Password: `admin123`

---

## 🚀 BƯỚC 6: Custom Domain (Optional)

### 6.1. Add Custom Domain

1. Mua domain (VD: `lms-dau.edu.vn`)
2. Vào Render Dashboard → Frontend Service → **Settings** → **Custom Domain**
3. Add domain: `lms-dau.edu.vn`
4. Cập nhật DNS records theo hướng dẫn Render:
   ```
   Type: CNAME
   Name: @
   Value: lms-dau-frontend.onrender.com
   ```

5. Đợi DNS propagate (1-24 giờ)

---

## ⚙️ BƯỚC 7: Seed Data (Lần đầu)

### 7.1. Seed qua API

Sau khi deploy, chạy các endpoint seed:

```bash
# 1. Seed users & courses
POST https://lms-dau-backend.onrender.com/api/seed/init

# 2. Seed majors & curriculum
# Chạy script local rồi upload data lên MongoDB Atlas
```

### 7.2. Hoặc seed từ MongoDB Compass

1. Connect MongoDB Atlas
2. Import collections từ backup

---

## 🔧 TROUBLESHOOTING

### Issue 1: Backend không start

**Giải pháp:**
- Check Logs trong Render Dashboard
- Verify MONGODB_URI đúng
- Kiểm tra MongoDB Atlas IP Whitelist (cho phép 0.0.0.0/0)

### Issue 2: CORS Error

**Giải pháp:**
```javascript
// backend/server.js
app.use(cors({
  origin: [
    'https://lms-dau-frontend.onrender.com',
    'http://localhost:3000'
  ],
  credentials: true
}));
```

### Issue 3: Build Frontend fail

**Giải pháp:**
- Kiểm tra `npm run build` local
- Fix warnings/errors
- Check node version: `"node": ">=18.0.0"`

### Issue 4: Database connection timeout

**Giải pháp:**
- MongoDB Atlas → Network Access → Add IP: `0.0.0.0/0`
- Restart backend service

---

## 📊 MONITORING

### Health Checks

Backend: `https://lms-dau-backend.onrender.com/health`

### Logs

Render Dashboard → Service → **Logs**

### Metrics

Render Dashboard → Service → **Metrics**

---

## 💰 PRICING

### Free Tier Limitations:
- **Backend**: Sleeps after 15 mins inactivity, cold start ~1 min
- **Frontend**: No sleep, always available
- **Database**: MongoDB Atlas Free: 512MB

### Upgrade Options:
- **Starter Plan**: $7/month (no sleep)
- **Standard Plan**: $25/month (better performance)

---

## 🎯 NEXT STEPS

1. ✅ Deploy backend
2. ✅ Deploy frontend
3. ✅ Seed data
4. ✅ Test login
5. ✅ Test features
6. 📧 Setup email (SendGrid/Mailgun)
7. 📱 Add monitoring (Sentry)
8. 🔒 Add rate limiting
9. 💾 Setup backups
10. 📈 Add analytics

---

## 📞 SUPPORT

**Render Docs**: https://render.com/docs  
**MongoDB Atlas**: https://www.mongodb.com/docs/atlas  
**GitHub**: https://github.com/haihoandaotao/lmsdau

---

**🎉 DEPLOYMENT COMPLETE!**

**Live URLs:**
- Frontend: https://lms-dau-frontend.onrender.com
- Backend: https://lms-dau-backend.onrender.com
- API Docs: https://lms-dau-backend.onrender.com/api-docs
