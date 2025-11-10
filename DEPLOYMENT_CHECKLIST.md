# ✅ RENDER DEPLOYMENT CHECKLIST

## Trước khi bắt đầu
- [x] Code đã push lên GitHub
- [x] MongoDB Atlas đang hoạt động
- [x] File cấu hình đã sẵn sàng (render.yaml, .env.production)

---

## 🔧 BACKEND DEPLOYMENT

### 1. Tạo Web Service
- [ ] Vào https://dashboard.render.com
- [ ] Click "New +" → "Web Service"
- [ ] Connect GitHub: `haihoandaotao/lmsdau`

### 2. Cấu hình Backend
```
Name: lms-dau-backend
Region: Singapore
Branch: master
Root Directory: backend
Runtime: Node
Build Command: npm install
Start Command: npm start
Instance: Free
```

### 3. Environment Variables
- [ ] `NODE_ENV` = `production`
- [ ] `PORT` = `5000`
- [ ] `MONGODB_URI` = `mongodb+srv://lms_admin:lmsdau123@cluster0.baofaov.mongodb.net/lms_database?retryWrites=true&w=majority`
- [ ] `JWT_SECRET` = `lms-dau-super-secret-key-2024-production`
- [ ] `JWT_EXPIRE` = `7d`
- [ ] `CLIENT_URL` = `http://localhost:3000` (tạm thời)

### 4. Deploy & Verify
- [ ] Click "Create Web Service"
- [ ] Đợi build (3-5 phút)
- [ ] Copy Backend URL: `________________`
- [ ] Test health: `/health` → Status OK ✅

---

## 🎨 FRONTEND DEPLOYMENT

### 1. Tạo Static Site
- [ ] Dashboard → "New +" → "Static Site"
- [ ] Connect repo: `haihoandaotao/lmsdau`

### 2. Cấu hình Frontend
```
Name: lms-dau-frontend
Region: Singapore
Branch: master
Root Directory: frontend
Build Command: npm install && npm run build
Publish Directory: build
```

### 3. Environment Variable
- [ ] `REACT_APP_API_URL` = `https://lms-dau-backend.onrender.com/api`
  *(Thay bằng Backend URL thực tế)*

### 4. Build & Verify
- [ ] Click "Create Static Site"
- [ ] Đợi build (5-10 phút)
- [ ] Copy Frontend URL: `________________`
- [ ] Test mở trang → Login hiển thị ✅

---

## 🔄 UPDATE CORS

### 1. Update Backend
- [ ] Vào Backend Service → Environment
- [ ] Edit `CLIENT_URL` = Frontend URL thực tế
- [ ] Save changes

### 2. Redeploy
- [ ] Manual Deploy → "Clear build cache & deploy"
- [ ] Đợi redeploy (1-2 phút)

---

## 🧪 TEST SYSTEM

### 1. Test Login
- [ ] Mở Frontend URL
- [ ] Login: `admin@dau.edu.vn` / `admin123`
- [ ] Redirect về Dashboard thành công ✅

### 2. Test API
- [ ] F12 → Network tab
- [ ] Login → Check POST request: Status 200 ✅
- [ ] No CORS errors ✅

### 3. Test Features
- [ ] View Dashboard ✅
- [ ] View Courses ✅
- [ ] View Curriculum (/curriculum) ✅
- [ ] Admin → Majors Management ✅
- [ ] View Course Detail ✅

---

## 🌱 SEED DATA (Nếu cần)

### Local Seed
```powershell
$env:MONGODB_URI="mongodb+srv://lms_admin:lmsdau123@cluster0.baofaov.mongodb.net/lms_database"

node backend/seeders/create-admin.js
node backend/seeders/seed-majors-curriculum.js
node backend/seeders/seed-full-curriculum-cntt.js
```

- [ ] Admin created ✅
- [ ] 3 Majors created ✅
- [ ] 50 Courses created ✅

---

## 📊 MONITORING

### Setup Alerts
- [ ] Backend Service → Settings → Notifications
- [ ] Add email: `________________`
- [ ] Enable deploy alerts

### Check Metrics
- [ ] View Logs tab
- [ ] Check Metrics tab (CPU, Memory, Requests)

---

## 🎉 DEPLOYMENT COMPLETE!

### Live URLs:
**Frontend:** https://________________  
**Backend:** https://________________  
**Health:** https://________________/health

### Test Accounts:
```
Admin: admin@dau.edu.vn / admin123
Student: student@example.com / password123
Teacher: teacher@example.com / password123
```

---

## 📝 NOTES

**Free Tier Limitations:**
- Backend sleeps after 15 min idle
- Cold start: ~1 minute
- 750 hours/month

**Upgrade to Starter ($7/month) for:**
- No sleep
- Better performance
- Dedicated resources

---

## 🚨 TROUBLESHOOTING

**Issue:** Backend deploy fail
- [ ] Check logs
- [ ] Verify package.json
- [ ] Test local: `npm install && npm start`

**Issue:** CORS error
- [ ] Update CLIENT_URL với frontend URL
- [ ] Redeploy backend
- [ ] Hard refresh (Ctrl+F5)

**Issue:** 502 Bad Gateway
- [ ] Đợi backend wake up (30-60s)
- [ ] Refresh page

**Issue:** Login fails
- [ ] Verify database connection
- [ ] Check MongoDB whitelist: 0.0.0.0/0
- [ ] Seed admin account

---

**Deployment Date:** _______________  
**Deployed By:** _______________  
**Status:** [ ] Success [ ] Issues: _______________
