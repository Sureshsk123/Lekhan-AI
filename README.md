# 🌳 LangSphere AI

**AI-Powered Indian Language Learning Platform for NRI Children**

LangSphere AI is a production-ready, full-stack educational platform that teaches native Indian languages (Tamil, Telugu, Hindi, Kannada, English) to NRI children using AI, handwriting recognition, voice tutoring, gamification, and cultural storytelling.

---

## ✨ Features

### 🎓 For Students (Age 5-15)

#### Core Learning Modules
- **📚 Structured Lessons** - 100-150 lessons per language
  - Alphabets, Vowels, Consonants
  - Words, Sentences, Conversations
  - Reading, Writing, Speaking, Listening practice
  - Interactive quizzes with instant feedback

- **✍️ Handwriting Tutor**
  - Upload handwritten images (camera or file)
  - AI-powered OCR with Tesseract.js
  - Spelling correction and feedback
  - Multi-language script support

- **✏️ Writing Canvas**
  - Interactive drawing canvas
  - Dotted tracing lines with stroke direction
  - Real-time feedback (green/red)
  - Letter-by-letter practice

- **🎤 AI Chat & Voice Tutor**
  - ChatGPT-style interface
  - Voice input (Speech-to-Text)
  - Voice output (Text-to-Speech)
  - Grammar correction and pronunciation hints
  - Auto-detects enrolled language

- **📖 Cultural Stories**
  - 50+ stories per language
  - Categories: Festival, Moral, Short, Epic
  - Audio narration
  - New vocabulary highlighting
  - Comprehension quizzes (10 questions)

- **🎮 Games Hub**
  - Crossword puzzles
  - Word search
  - Match letters
  - Fill in the blanks
  - Dynamic puzzles from lesson vocabulary

#### Gamification System
- **🔥 Daily Streak Counter** - Track consecutive days
- **⚡ XP Points** - Earn experience from activities
- **💎 Diamonds Currency** - Reward system
- **🏆 Levels** - Progress through levels (1000 XP = 1 level)
- **🎖️ Achievement Badges** - Unlock special achievements
- **🏪 Epic Store** - Spend diamonds on:
  - Custom avatars
  - Background themes
  - Stickers
  - Bonus stories
  - Special lessons

#### Daily Features
- **Word of the Day** - Auto-changes daily
- **Story of the Day** - Auto-changes daily
- **Magical Forest UI** - Child-friendly animated interface
- **Flying Birds Animation** - Interactive menu navigation

### 👨‍👩‍👧 For Parents

#### Analytics Dashboard
- **📊 Comprehensive Statistics**
  - Total time spent learning
  - Words mastered count
  - Average accuracy percentage
  - Weekly consistency tracking

- **📈 Visual Charts**
  - Weekly activity bar chart
  - Heatmap of active days
  - Skill mastery progress bars

- **🎯 Skill Tracking**
  - Handwriting proficiency
  - Pronunciation accuracy
  - Vocabulary growth
  - Cultural knowledge

- **📄 Reports**
  - Download weekly PDF reports
  - Detailed progress insights

---

## 🛠️ Technology Stack

### Frontend
- **React** - UI framework
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Router** - Navigation
- **Axios** - API calls
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File uploads

### AI & ML (Open Source)
- **Tesseract.js** - OCR for handwriting recognition
- **TrOCR** - Advanced handwriting models (future)
- **Vosk / Whisper** - Speech-to-Text (future integration)
- **Coqui TTS** - Text-to-Speech (future integration)
- **Open-source LLM** - Multilingual chat tutor (future)

---

## 📁 Project Structure

```
langsphere-ai/
├── backend/
│   ├── models/
│   │   ├── User.js          # User schema with gamification
│   │   ├── Progress.js      # Learning progress tracking
│   │   ├── Lesson.js        # Lesson content
│   │   └── Story.js         # Cultural stories
│   ├── routes/
│   │   ├── auth.js          # Authentication
│   │   ├── user.js          # User management
│   │   ├── lessons.js       # Lesson endpoints
│   │   ├── stories.js       # Story endpoints
│   │   ├── progress.js      # Progress tracking
│   │   └── ocr.js           # Handwriting OCR
│   ├── server.js            # Express server
│   ├── package.json
│   └── .env
├── src/
│   ├── components/
│   │   └── TopBar.jsx       # Navigation bar with stats
│   ├── context/
│   │   └── AuthContext.jsx  # Global auth state
│   ├── pages/
│   │   ├── Signup.jsx       # Registration page
│   │   ├── Login.jsx        # Login page
│   │   ├── StudentDashboard.jsx    # Main student hub
│   │   ├── ParentDashboard.jsx     # Parent analytics
│   │   ├── HandwritingTutor.jsx    # OCR upload
│   │   ├── WritingCanvas.jsx       # Drawing practice
│   │   ├── VoiceTutor.jsx          # Chat & voice
│   │   ├── Lessons.jsx             # Lesson list
│   │   ├── LessonDetail.jsx        # Single lesson
│   │   ├── CulturalStories.jsx     # Story list
│   │   ├── StoryDetail.jsx         # Single story
│   │   ├── Games.jsx               # Games hub
│   │   └── EpicStore.jsx           # Rewards shop
│   ├── App.jsx              # Main app with routing
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── public/
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

#### 1. Clone the repository
```bash
cd "c:\Users\dines\Downloads\learning problem 4"
```

#### 2. Install Frontend Dependencies
```bash
npm install
```

#### 3. Install Backend Dependencies
```bash
cd backend
npm install
```

#### 4. Configure Environment Variables

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:5000/api
```

**Backend (backend/.env):**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/langsphere
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
```

#### 5. Start MongoDB
```bash
# If using local MongoDB
mongod
```

#### 6. Start Backend Server
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

#### 7. Start Frontend Development Server
```bash
# In root directory
npm run dev
# App runs on http://localhost:5173
```

---

## 🎨 Design Features

### Child-Friendly UI
- **Forest Theme** - Magical woodland aesthetic
- **Vibrant Colors** - Engaging color palette
- **Smooth Animations** - Framer Motion effects
- **Large Fonts** - Easy readability
- **Emoji & Icons** - Visual learning aids

### Responsive Design
- Mobile-first approach
- Tablet optimization
- Desktop layouts
- Touch-friendly controls

### Accessibility
- High contrast colors
- Clear typography
- Keyboard navigation
- Screen reader support

---

## 🔐 Authentication System

### User Modes
1. **Student Mode**
   - Access to all learning features
   - Gamification and rewards
   - Progress tracking

2. **Parent Mode**
   - Analytics dashboard
   - Child progress monitoring
   - Report downloads

### Security Features
- JWT token authentication
- Password hashing with bcryptjs
- Protected routes
- Session management

---

## 📊 Database Schema

### User Model
- Authentication (email, password, phone)
- Profile (username, avatar, gender)
- Gamification (XP, diamonds, streak, level)
- Achievements & inventory
- Parent-child relationships

### Progress Model
- Per-language tracking
- Lessons completed
- Words learned
- Skill levels (6 categories)
- Weekly activity logs

### Lesson Model
- Multi-section content (reading, writing, speaking, listening)
- Interactive quizzes
- Vocabulary lists
- Stroke-by-stroke writing guides

### Story Model
- Cultural content
- Audio narration
- Comprehension questions
- New vocabulary

---

## 🎯 Roadmap

### Phase 1 (Current) ✅
- Core authentication
- Student & parent dashboards
- Basic lesson structure
- Handwriting OCR
- Writing canvas
- Voice chat interface
- Cultural stories
- Games hub
- Epic store
- Gamification system

### Phase 2 (Future)
- [ ] Advanced AI models integration
- [ ] Real-time voice pronunciation feedback
- [ ] Adaptive learning paths
- [ ] Multiplayer games
- [ ] Social features (friends, leaderboards)
- [ ] Mobile app (React Native)
- [ ] Offline mode
- [ ] Teacher dashboard
- [ ] Content management system

### Phase 3 (Future)
- [ ] AR/VR learning experiences
- [ ] Live tutoring sessions
- [ ] Community forums
- [ ] Certification system
- [ ] API for third-party integrations

---

## 🤝 Contributing

This is a production-ready educational platform. Contributions are welcome!

### Development Guidelines
1. Follow React best practices
2. Use Tailwind CSS for styling
3. Maintain consistent code formatting
4. Write meaningful commit messages
5. Test thoroughly before submitting

---

## 📝 License

This project is created for educational purposes.

---

## 👥 Target Users

- **Primary**: NRI children aged 5-15
- **Secondary**: Parents monitoring progress
- **Languages**: Tamil, Telugu, Hindi, Kannada, English

---

## 🌟 Key Differentiators

1. **100% Free & Open Source** - No paid APIs
2. **Child-Centric Design** - Magical, engaging UI
3. **Comprehensive Learning** - Reading, writing, speaking, listening
4. **Cultural Integration** - Stories, festivals, traditions
5. **Gamification** - Makes learning fun and addictive
6. **Parent Insights** - Detailed analytics and reports
7. **AI-Powered** - Handwriting recognition, voice tutoring
8. **Multi-Language** - 5 Indian languages supported

---

## 📧 Support

For questions or issues, please create an issue in the repository.

---

**Built with ❤️ for NRI children learning their native languages**

🌳 **LangSphere AI** - Where Language Learning Meets Magic! ✨
