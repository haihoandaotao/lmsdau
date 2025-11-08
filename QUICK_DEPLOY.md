# ⚡ QUICK REFERENCE - RENDER DEPLOYMENT

## 🔗 Links quan trọng
- **Render Dashboard**: https://dashboard.render.com
- **GitHub Repo**: https://github.com/haihoandaotao/lmsdau
- **MongoDB Atlas**: https://cloud.mongodb.com

---

## 📝 Configuration Values (COPY & PASTE)

### Service Settings
```
Name: lms-api
Region: Singapore
Branch: master
Runtime: Node
Instance Type: Free
```

### Build & Start Commands
```bash
# Build Command
npm install && cd frontend && npm install && npm run build && cd ..

# Start Command
npm start
```

### Environment Variables
```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://lms_admin:lmsdau123@cluster0.baofaov.mongodb.net/lms_database?retryWrites=true&w=majority
JWT_SECRET=[Generate]
```

---

## 🎯 Deploy Checklist

- [ ] Vào https://dashboard.render.com
- [ ] Click "New +" → "Web Service"
- [ ] Connect repo: haihoandaotao/lmsdau
- [ ] Nhập Name: lms-api
- [ ] Chọn Region: Singapore
- [ ] Branch: master
- [ ] Runtime: Node
- [ ] Copy/paste Build Command
- [ ] Copy/paste Start Command
- [ ] Add 4 Environment Variables
- [ ] Click "Create Web Service"
- [ ] Đợi 5-10 phút
- [ ] Kiểm tra Status = "Live"
- [ ] Test URL

---

## ✅ Kiểm tra thành công

Sau khi deploy xong, kiểm tra:

1. **Status**: Live (màu xanh)
2. **Logs**: Có dòng "✅ Connected to MongoDB"
3. **URL**: Mở được trang Login
4. **Register**: Tạo được tài khoản
5. **Login**: Đăng nhập thành công

---

## 🚨 Troubleshooting Quick Fix

### Build failed
→ Kiểm tra Build Command, phải đúng y chang

### MongoDB connection error
→ Kiểm tra MONGODB_URI, đảm bảo password = lmsdau123

### Service offline
→ Free tier bị sleep, đợi 30 giây để wake up

### 404 Not Found
→ Frontend chưa build, re-deploy lại

---

## 📞 Test Account (Sau khi deploy)

Tạo tài khoản đầu tiên:
- Email: admin@lms.com
- Password: admin123
- Role: Admin (tự động)

Sau đó test:
1. Tạo khóa học
2. Upload assignment
3. Forum post
4. Check notifications

---

**Thời gian deploy**: ~5-10 phút
**Chi phí**: $0 (FREE)
**URL**: https://lms-api-[random].onrender.com
