# 🔧 Technical Architecture - LangSphere AI

## System Overview

LangSphere AI is a full-stack MERN application with AI integration for language learning.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Pages   │  │Components│  │ Context  │  │  Styles  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/REST API
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend (Express + Node.js)               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Routes  │  │Middleware│  │  Models  │  │   Auth   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ Mongoose ODM
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Database (MongoDB)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Users   │  │ Progress │  │ Lessons  │  │ Stories  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    AI Services (Future)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   OCR    │  │   STT    │  │   TTS    │  │   LLM    │   │
│  │Tesseract │  │  Vosk    │  │  Coqui   │  │Open-source│   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## Frontend Architecture

### Technology Stack
- **React 18** - Component-based UI
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animation library
- **Axios** - HTTP client
- **Vite** - Build tool & dev server

### State Management
- **Context API** - Global authentication state
- **Local State** - Component-level state with useState
- **Session Storage** - JWT token persistence

### Routing Structure
```javascript
/                       → Redirect to /login
/signup                 → Registration page
/login                  → Authentication page
/dashboard              → Student dashboard (protected)
/handwriting            → Handwriting tutor (protected)
/writing-canvas         → Writing practice (protected)
/voice-tutor            → AI chat & voice (protected)
/lessons/:language      → Lesson list (protected)
/lesson/:id             → Lesson detail (protected)
/stories/:language      → Story list (protected)
/story/:id              → Story detail (protected)
/games                  → Games hub (protected)
/store                  → Epic store (protected)
/parent-dashboard       → Parent analytics (protected)
```

### Component Hierarchy
```
App
├── AuthProvider (Context)
│   ├── TopBar (Global Navigation)
│   └── Routes
│       ├── Public Routes
│       │   ├── Signup
│       │   └── Login
│       └── Protected Routes
│           ├── StudentDashboard
│           ├── HandwritingTutor
│           ├── WritingCanvas
│           ├── VoiceTutor
│           ├── Lessons
│           ├── LessonDetail
│           ├── CulturalStories
│           ├── StoryDetail
│           ├── Games
│           ├── EpicStore
│           └── ParentDashboard
```

### Styling Strategy
- **Tailwind Utility Classes** - Primary styling method
- **Custom CSS Classes** - Reusable components (.btn-primary, .card)
- **CSS Variables** - Theme colors in tailwind.config.js
- **Animations** - Framer Motion for complex animations
- **Responsive Design** - Mobile-first with md:, lg: breakpoints

---

## Backend Architecture

### Technology Stack
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Token-based authentication
- **bcryptjs** - Password hashing
- **Multer** - File upload handling
- **Tesseract.js** - OCR processing

### API Endpoints

#### Authentication Routes (`/api/auth`)
```
POST   /signup          Create new user account
POST   /login           Authenticate user
```

#### User Routes (`/api/user`)
```
GET    /profile         Get user profile (protected)
PUT    /profile         Update user profile (protected)
POST   /xp              Add XP to user (protected)
POST   /diamonds        Update diamond balance (protected)
POST   /achievement     Add achievement (protected)
POST   /purchase        Purchase store item (protected)
```

#### Lesson Routes (`/api/lessons`)
```
GET    /:language       Get all lessons for language (protected)
GET    /:language/:id   Get single lesson (protected)
```

#### Story Routes (`/api/stories`)
```
GET    /:language       Get all stories for language (protected)
GET    /:language/:id   Get single story (protected)
```

#### Progress Routes (`/api/progress`)
```
GET    /:language       Get user progress for language (protected)
POST   /lesson          Update lesson completion (protected)
POST   /word            Add learned word (protected)
PUT    /skills          Update skill levels (protected)
GET    /analytics/:id   Get analytics for parent (protected)
```

#### OCR Routes (`/api/ocr`)
```
POST   /handwriting     Process handwriting image (protected)
```

### Middleware
```javascript
// Authentication Middleware
protect(req, res, next)
  - Verifies JWT token
  - Attaches user to request
  - Returns 401 if invalid

// Error Handling Middleware
errorHandler(err, req, res, next)
  - Catches all errors
  - Returns formatted error response
  - Logs error details

// CORS Middleware
cors({ origin: FRONTEND_URL })
  - Allows cross-origin requests
  - Configured for frontend URL
```

---

## Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  username: String (unique, required),
  email: String (unique, required),
  phone: String (required),
  password: String (hashed, required),
  gender: String (enum: male/female/other),
  avatar: String (default: 'avatar1.png'),
  mode: String (enum: student/parent),
  enrolledLanguages: [String],
  xp: Number (default: 0),
  diamonds: Number (default: 100),
  streak: {
    current: Number (default: 0),
    longest: Number (default: 0),
    lastLoginDate: Date
  },
  level: Number (default: 1),
  achievements: [{
    name: String,
    icon: String,
    earnedAt: Date,
    description: String
  }],
  inventory: [{
    itemType: String,
    itemId: String,
    purchasedAt: Date
  }],
  children: [ObjectId] (ref: User),
  parent: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### Progress Collection
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User, required),
  language: String (enum: tamil/telugu/hindi/kannada/english),
  lessonsCompleted: [{
    lessonId: String,
    completedAt: Date,
    score: Number,
    accuracy: Number,
    timeSpent: Number,
    xpEarned: Number
  }],
  wordsLearned: [{
    word: String,
    translation: String,
    learnedAt: Date,
    proficiency: Number (0-100)
  }],
  skillLevels: {
    handwriting: Number (0-100),
    pronunciation: Number (0-100),
    vocabulary: Number (0-100),
    culture: Number (0-100),
    listening: Number (0-100),
    reading: Number (0-100)
  },
  currentLevel: String (enum: alphabets/vowels/consonants/words/sentences/conversations),
  weeklyActivity: [{
    date: Date,
    minutesSpent: Number,
    lessonsCompleted: Number,
    xpEarned: Number
  }],
  totalTimeSpent: Number (default: 0),
  lastPracticeDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Lesson Collection
```javascript
{
  _id: ObjectId,
  language: String (required),
  level: String (required),
  lessonNumber: Number (required),
  title: String (required),
  description: String,
  content: {
    reading: {
      text: String,
      audio: String,
      translation: String
    },
    writing: [{
      character: String,
      strokes: [{
        startPoint: { x: Number, y: Number },
        endPoint: { x: Number, y: Number },
        controlPoints: [{ x: Number, y: Number }]
      }],
      tracingImage: String
    }],
    speaking: [{
      phrase: String,
      pronunciation: String,
      audio: String
    }],
    listening: [{
      audio: String,
      question: String,
      options: [String],
      correctAnswer: Number
    }]
  },
  quiz: [{
    question: String,
    type: String (enum: multiple-choice/fill-blank/match/true-false),
    options: [String],
    correctAnswer: Mixed,
    explanation: String,
    points: Number
  }],
  vocabulary: [{
    word: String,
    translation: String,
    pronunciation: String,
    example: String,
    audio: String
  }],
  xpReward: Number (default: 50),
  diamondReward: Number (default: 10),
  prerequisites: [String],
  difficulty: String (enum: beginner/intermediate/advanced),
  createdAt: Date,
  updatedAt: Date
}
```

### Story Collection
```javascript
{
  _id: ObjectId,
  language: String (required),
  category: String (enum: festival/moral/short/epic),
  title: String (required),
  content: String (required),
  translation: String,
  audio: String,
  coverImage: String,
  newWords: [{
    word: String,
    meaning: String,
    pronunciation: String
  }],
  comprehensionQuestions: [{
    question: String,
    options: [String],
    correctAnswer: Number,
    explanation: String
  }],
  culturalContext: String,
  xpReward: Number (default: 30),
  diamondReward: Number (default: 5),
  difficulty: String (enum: easy/medium/hard),
  readCount: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

---

## Authentication Flow

### Signup Process
```
1. User fills signup form
2. Frontend validates input
3. POST /api/auth/signup
4. Backend validates data
5. Hash password with bcryptjs
6. Create user in database
7. Generate JWT token
8. Return token + user data
9. Frontend stores token in localStorage
10. Redirect to dashboard
```

### Login Process
```
1. User enters credentials
2. POST /api/auth/login
3. Find user by email
4. Compare password with bcrypt
5. Update streak counter
6. Generate JWT token
7. Return token + user data
8. Frontend stores token
9. Redirect to appropriate dashboard
```

### Protected Route Access
```
1. User navigates to protected route
2. Frontend checks for token
3. Add token to Authorization header
4. Backend verify JWT
5. Attach user to request
6. Allow access if valid
7. Return 401 if invalid
```

---

## AI Integration (Current & Future)

### Current Implementation

#### Handwriting OCR (Tesseract.js)
```javascript
// Client uploads image
POST /api/ocr/handwriting
  - Receives image file
  - Detects language
  - Runs Tesseract OCR
  - Returns detected text
  - Returns confidence score
  - Returns corrections (placeholder)
```

### Future AI Services

#### Speech-to-Text (Vosk/Whisper)
```
Service: http://localhost:8002
- Real-time voice recognition
- Multi-language support
- Pronunciation scoring
```

#### Text-to-Speech (Coqui TTS)
```
Service: http://localhost:8001
- Natural voice synthesis
- Multi-language support
- Adjustable speed/pitch
```

#### LLM Chat Tutor (Open-source)
```
Service: http://localhost:8003
- Conversational AI
- Grammar correction
- Cultural context
- Adaptive responses
```

---

## Security Measures

### Password Security
- **bcryptjs** with salt rounds (10)
- Passwords never stored in plain text
- Password field excluded from queries by default

### JWT Security
- Secret key stored in environment variables
- 7-day expiration
- Token verified on every protected route
- Logout clears token from client

### Input Validation
- Email format validation
- Phone number validation (10 digits)
- Password minimum length (6 characters)
- Mongoose schema validation

### CORS Configuration
- Whitelist frontend URL
- Credentials allowed
- Prevents unauthorized access

---

## Performance Optimizations

### Frontend
- **Code Splitting** - React.lazy for route-based splitting
- **Memoization** - useMemo for expensive computations
- **Debouncing** - Input debouncing for search
- **Image Optimization** - Lazy loading images
- **Bundle Size** - Tree-shaking with Vite

### Backend
- **Database Indexing** - Indexed fields (email, username)
- **Query Optimization** - Select only needed fields
- **Caching** - Redis for frequently accessed data (future)
- **Connection Pooling** - MongoDB connection pool

### Database
- **Compound Indexes** - user + language for progress
- **Lean Queries** - Return plain objects when possible
- **Pagination** - Limit results for large datasets

---

## Deployment Strategy

### Frontend Deployment (Vercel/Netlify)
```bash
npm run build
# Outputs to /dist directory
# Deploy dist folder
```

### Backend Deployment (Heroku/Railway/Render)
```bash
# Set environment variables
# Deploy backend folder
# Ensure MongoDB Atlas connection
```

### Environment Variables
```
Production Frontend:
VITE_API_URL=https://api.langsphere.com/api

Production Backend:
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=<strong-secret>
FRONTEND_URL=https://langsphere.com
```

---

## Testing Strategy (Future)

### Unit Tests
- Component testing with Jest
- API endpoint testing with Supertest
- Database model testing

### Integration Tests
- Full authentication flow
- Lesson completion flow
- Payment/purchase flow

### E2E Tests
- Cypress for user journeys
- Critical path testing
- Cross-browser testing

---

## Monitoring & Analytics (Future)

### Application Monitoring
- Error tracking (Sentry)
- Performance monitoring (New Relic)
- Uptime monitoring (UptimeRobot)

### User Analytics
- Google Analytics
- User behavior tracking
- Conversion funnel analysis

### Database Monitoring
- MongoDB Atlas monitoring
- Query performance analysis
- Storage usage tracking

---

## Scalability Considerations

### Horizontal Scaling
- Stateless backend design
- Load balancer (Nginx)
- Multiple backend instances

### Database Scaling
- MongoDB sharding
- Read replicas
- Caching layer (Redis)

### CDN Integration
- Static assets on CDN
- Image optimization
- Global distribution

---

## Development Workflow

### Git Workflow
```
main          → Production-ready code
develop       → Integration branch
feature/*     → New features
bugfix/*      → Bug fixes
hotfix/*      → Critical fixes
```

### Code Quality
- ESLint for linting
- Prettier for formatting
- Husky for pre-commit hooks
- Code reviews required

---

**Built with modern best practices for scalability, security, and performance** 🚀
