# Changelog

All notable changes to **LangSphere AI** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-07-30

### 🚀 Added
- **Authentication & Security System**
  - Custom JWT Bearer Authentication with email/password flow.
  - Domain restrictions enforcing allowed domains (`@gmail.com` and `@saveetha.com`).
  - Bcrypt password hashing, session persistence, auto-login post-signup, and secure logout.
  - Complete Auth pages: Welcome, Login, Sign Up, Forgot Password, Reset Password.
  - Completely removed Google OAuth dependencies and buttons per enterprise specification.

- **Multilingual Curriculum System (Lessons)**
  - Comprehensive database curriculum for 4 languages: **English**, **Tamil**, **Hindi**, **Telugu**.
  - 3 proficiency levels per language: **Beginner**, **Intermediate**, **Advanced**.
  - Structured modules, topics, and lessons containing rich JSON exercises:
    - **Vocabulary**: Pronunciation, definitions, transliterations, and context examples.
    - **Grammar**: Structural rules, usage guidelines, and sample sentences.
    - **Examples**: Native contextual expressions.
    - **Exercises**: Interactive practice modules.
    - **Quizzes**: Linked multiple-choice evaluations per lesson.
  - Full lesson completion flow awarding XP and Coins directly to user account.

- **Cultural Storybook Reader**
  - Story catalogue categorized by language (`en`, `ta`, `hi`, `te`) and difficulty level.
  - Page-by-page interactive reader with progress tracking.
  - Instant English translation toggle for native sentences.
  - SpeechSynthesis Text-to-Speech (TTS) audio narration.

- **Quiz & Assessment Engine**
  - Dynamic quiz rendering with option shuffling.
  - Proportional XP and Coin rewards based on quiz percentage score.
  - Per-question correct/incorrect feedback with correct answers revealed post-submission.
  - Quiz attempt history storage and score logging.
  - Automated lesson status update upon passing associated quiz (score ≥ 70%).

- **Smart Gamification & Epic Shop**
  - Virtual Economy: Coins earned via lessons/quizzes used for item purchases.
  - Item Categories: Themes, Avatars, Frames, Titles, Boosters, Badges.
  - Immediate user balance checks, item ownership validation, and real-time inventory updates.
  - One-click equip system mutating user avatar, frame, or title.

- **AI-Powered Learning Suite**
  - **AI Tutor**: Real-time natural language conversational practice backed by Gemini 2.5 Flash, supporting session history and conversation management.
  - **Handwriting Evaluator**: Canvas-based drawing tool with Undo/Clear controls and AI visual feedback analyzing stroke accuracy.
  - **Vision OCR Extractor**: Image/document scanner extracting text and providing contextual translations.
  - Graceful fallback messaging when `GEMINI_API_KEY` is not present, preventing application crashes.

- **Smart Analytics Dashboard**
  - Dynamic metrics displaying Total XP, Current Day Streak, Coin Balance, and Calculated User Level.
  - Weekly 7-day activity heatmap tracking lesson activity and daily XP gains.
  - AI-driven weak topic recommendations directing users to relevant lessons.
  - Recent activity timeline and quiz attempt history log.

### 💅 Changed & Refactored
- Ported backend architecture from legacy Express JS to fully typed **TypeScript + Express + Prisma ORM + PostgreSQL**.
- Unified frontend API client configuration pointing to production backend port `5005`.
- Updated branding across footer and navigation: *© 2026 LangSphere AI. All Rights Reserved. Developed at SIMATS Engineering.*
- Enforced strict enterprise design aesthetics: neutral color palettes, border-subtle glassmorphism, responsive grid layouts, and zero intrusive glow/blur effects.

### 🛡️ Security & Performance
- Zero TypeScript compilation errors (`tsc --noEmit`).
- Production bundle optimization (`vite build`) producing minified production assets.
- Strict JWT middleware protection on all authenticated API endpoints (`/lessons/complete`, `/quizzes/:quizId/submit`, `/shop/purchase`, `/dashboard`, `/ai/tutor`, `/handwriting`, `/ocr`).

---

[1.0.0]: https://github.com/saveetha/langsphere-ai/releases/tag/v1.0.0
