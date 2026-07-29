# 🚀 Quick Start Guide

## Prerequisites Check
- ✅ Node.js installed (v16+)
- ✅ MongoDB running (local or Atlas)

## Step 1: Install Dependencies

### Frontend
```bash
npm install
```

### Backend
```bash
cd backend
npm install
cd ..
```

## Step 2: Configure Environment

Create `.env` in root:
```env
VITE_API_URL=http://localhost:5000/api
```

Create `backend/.env`:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/langsphere
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
```

## Step 3: Start MongoDB

### Option A: Local MongoDB
```bash
mongod
```

### Option B: MongoDB Atlas
Update `MONGODB_URI` in `backend/.env` with your Atlas connection string

## Step 4: Seed Database (Optional)
```bash
cd backend
node seed.js
```

## Step 5: Start Backend Server
```bash
cd backend
npm start
# Or for development with auto-reload:
npm run dev
```

Backend will run on: **http://localhost:5000**

## Step 6: Start Frontend (New Terminal)
```bash
npm run dev
```

Frontend will run on: **http://localhost:5173**

## 🎉 You're Ready!

Open your browser and navigate to: **http://localhost:5173**

### Demo Accounts

**Student Account:**
- Email: student@demo.com
- Password: password123

**Parent Account:**
- Email: parent@demo.com
- Password: password123

Or create a new account via the Signup page!

---

## 🛠️ Development Commands

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Backend
```bash
npm start            # Start server
npm run dev          # Start with nodemon (auto-reload)
node seed.js         # Seed database with sample data
```

---

## 📝 Project Structure

```
langsphere-ai/
├── src/              # Frontend React code
├── backend/          # Backend Express API
├── public/           # Static assets
└── README.md         # Full documentation
```

---

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check `MONGODB_URI` in `backend/.env`
- For Atlas, whitelist your IP address

### Port Already in Use
- Change `PORT` in `backend/.env`
- Update `VITE_API_URL` in root `.env`

### Module Not Found
```bash
# Reinstall dependencies
npm install
cd backend && npm install
```

---

## 🌟 Features to Explore

1. **Student Dashboard** - Magical forest theme with animated birds
2. **Handwriting Tutor** - Upload and analyze handwriting
3. **Writing Canvas** - Practice letter tracing
4. **Voice Tutor** - Chat with AI in your language
5. **Cultural Stories** - Read and listen to stories
6. **Games** - Play educational games
7. **Epic Store** - Buy items with diamonds
8. **Parent Dashboard** - View analytics and progress

---

**Happy Learning! 🌳✨**
