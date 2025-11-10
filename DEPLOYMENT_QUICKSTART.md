# 🚀 Quick Start - Deploy LMS to Render

## 📋 Tóm tắt
Hệ thống LMS đã được cấu hình sẵn để deploy lên **Render.com** với:
- ✅ Backend (Node.js + Express + MongoDB)
- ✅ Frontend (React + Material-UI)
- ✅ MongoDB Atlas (Cloud Database)

---

## 🎯 3 Files quan trọng

1. **`DEPLOYMENT_CHECKLIST.md`** - Checklist ngắn gọn, tick từng bước
2. **`DEPLOYMENT_STEPS.md`** - Hướng dẫn chi tiết từng bước với screenshots guide
3. **`DEPLOYMENT_RENDER.md`** - Technical guide đầy đủ

---

## ⚡ Deploy nhanh (10 phút)

### Bước 1: Tạo Backend
```
1. Vào https://dashboard.render.com
2. New + → Web Service
3. Connect GitHub: haihoandaotao/lmsdau
4. Cấu hình:
   - Name: lms-dau-backend
   - Root: backend
   - Build: npm install
   - Start: npm start
5. Add env vars (xem checklist)
6. Create → Đợi 3-5 phút
7. Copy URL backend
```

### Bước 2: Tạo Frontend
```
1. New + → Static Site
2. Connect repo: haihoandaotao/lmsdau
3. Cấu hình:
   - Name: lms-dau-frontend
   - Root: frontend
   - Build: npm install && npm run build
   - Publish: build
4. Add env: REACT_APP_API_URL = (Backend URL)/api
5. Create → Đợi 5-10 phút
6. Copy URL frontend
```

### Bước 3: Update CORS
```
1. Backend → Environment → CLIENT_URL = (Frontend URL)
2. Redeploy backend
3. Test login!
```

---

## ✅ Test accounts

```
Admin:
  Email: admin@dau.edu.vn
  Password: admin123

Student:
  Email: student@example.com
  Password: password123
```

---

## 🔗 URLs mẫu

Sau khi deploy, bạn sẽ có:
```
Frontend: https://lms-dau-frontend.onrender.com
Backend:  https://lms-dau-backend.onrender.com
Health:   https://lms-dau-backend.onrender.com/health
```

---

## 📞 Need help?

- **Quick checklist:** `DEPLOYMENT_CHECKLIST.md`
- **Detailed steps:** `DEPLOYMENT_STEPS.md`
- **Technical docs:** `DEPLOYMENT_RENDER.md`
- **Issues:** https://github.com/haihoandaotao/lmsdau/issues

---

## 💡 Tips

**Free Tier:**
- Backend sleeps sau 15 phút → Cold start ~1 min
- Frontend luôn available

**Upgrade ($7/month):**
- No sleep
- Better performance

---

**Good luck! 🎉**
