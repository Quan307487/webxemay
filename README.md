# 🏍 Website Bán Xe Máy - Full Stack

## 🏗️ Cấu trúc dự án
```
webxemay/
├── backend/       ← NestJS API (port 3001)
├── frontend/      ← Next.js Customer (port 3000)
├── admin/         ← React Vite Admin (port 5173)
└── database_mysql.sql
```

## 🚀 Khởi động dự án (Khuyên dùng)
Bạn có thể chạy tất cả các server chỉ với 1 lệnh từ thư mục gốc:

```bash
# Chạy cả 3 (Backend, Frontend, Admin)
npm run dev

# Chỉ chạy Backend và Frontend (Khách hàng)
npm run dev:app
```

## 🛠 Khởi động thủ công (Từng phần)

### 1. Đảm bảo XAMPP MySQL đang chạy
Mở XAMPP Control Panel → Start MySQL

### 2. Khởi động Backend
```bash
cd backend
npm run start:dev
```
→ API: http://localhost:3001/api  
→ Swagger: http://localhost:3001/api/docs

### 3. Khởi động Frontend (Customer)
```bash
cd frontend
npm run dev
```
→ http://localhost:3000

### 4. Khởi động Admin
```bash
cd admin
npm run dev
```
→ http://localhost:5173

## 🔐 Tài khoản test (tạo thủ công qua API)
- POST http://localhost:3001/api/auth/register
- Để tạo tài khoản admin: vào MySQL → UPDATE users SET quyen='admin' WHERE email='...'

## 📚 Tech Stack
| Layer | Tech |
|-------|------|
| Backend | NestJS + TypeORM + MySQL |
| Frontend | Next.js 14 (App Router) + Zustand |
| Admin | React + Vite + React Router |
| Database | MySQL 8 (XAMPP) |
| Auth | JWT + bcrypt |
| File Upload | Multer |
