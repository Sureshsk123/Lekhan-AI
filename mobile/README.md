# LangSphere Mobile Application 📱

LangSphere Mobile is an enterprise-grade React Native mobile application powered by **Expo SDK 51**, **Expo Router**, **TypeScript (Strict Mode)**, **NativeWind (Tailwind CSS)**, **React Query**, and **Reanimated 3**.

It connects to the LangSphere backend API, enabling interactive Indian language learning across **iOS** and **Android** devices.

---

## 🌟 Key Features

1. **Authentication & Security**
   - JWT token storage via `Expo SecureStore`
   - Auto-login, Remember Me, and stateless session refresh.
2. **Home Landing Dashboard**
   - Live XP Counter, Streak status, Today's Goal progress rings, AI Tutor shortcuts, and Daily Challenges.
3. **Native Lesson Browser**
   - Search, multi-language chips, difficulty filters, lesson player, and offline caching.
4. **Story Library & Reader**
   - Bilingual read mode, TTS voice player, interactive vocabulary popups, bookmarking, and offline access.
5. **AI Tutor Interface**
   - ChatGPT-style interactive chat with multi-session management, streaming feel, typing animation, markdown code block support, message copy, and regeneration.
6. **Voice Practice Engine**
   - Speech-to-Text (STT), Text-to-Speech (TTS), real-time pronunciation scoring, accent feedback, and animated waveforms.
7. **Vision OCR Text Scanner**
   - Camera & Gallery image picker with crop preview, text extraction, grammar correction notes, and history.
8. **Native Handwriting Canvas**
   - Interactive touch drawing canvas with stroke geometry analysis, accuracy scores, undo/redo/clear, and brush color controls.
9. **Animated Quiz Engine**
   - MCQ, fill-in-the-blanks, listening, speaking, and image questions with XP Reanimated counter animations, explanations, and streak updates.
10. **Shop & Customization**
    - Unlockable themes, avatars, frames, titles, and boosters with purchase flows and inventory equipping.
11. **Global & Country Leaderboard**
    - Animated 3D podium for top 3 rankers with weekly and monthly scope filters.
12. **Smart Analytics Dashboard**
    - Weekly activity bar charts, 30-day activity heatmaps, study hours tracking, and AI recommendations.
13. **Parent Portal & Admin Console**
    - Child linking, weak topics overview, role management, and system user analytics.
14. **Universal Search & PDF Reports**
    - Global instant search across all resources and PDF learning report generation/sharing.

---

## 🚀 Quickstart & Setup

### Prerequisites
- Node.js >= 18
- npm >= 9
- Expo CLI (`npx expo`)
- iOS Simulator (macOS) / Android Emulator / Expo Go app

### Installation
```bash
cd mobile
npm install
```

### Environment Configuration
The app automatically detects your running environment:
- **iOS Simulator / Web**: `http://localhost:5001/api`
- **Android Emulator**: `http://10.0.2.2:5001/api`
- **Physical Device**: Set `EXPO_PUBLIC_API_URL` in `.env` (e.g. `EXPO_PUBLIC_API_URL=http://<YOUR_LAN_IP>:5001/api`)

### Running Locally
```bash
# Start Expo dev server
npm start

# Run on Android Emulator
npm run android

# Run on iOS Simulator
npm run ios
```

---

## 🧪 Testing & Self-Validation Commands

```bash
# Type Check
npm run typecheck

# Lint Check
npm run lint

# Run Unit & Integration Test Suite
npm test

# Expo Diagnostic Doctor
npm run doctor
```

---

## 📦 Building for Production & APK Generation

### 1. Configure EAS CLI
```bash
npm install -g eas-cli
eas login
eas build:configure
```

### 2. Android APK Generation (Direct Installable APK)
Add `eas.json` configuration:
```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {}
  }
}
```
Run APK Build:
```bash
eas build -p android --profile preview
```

### 3. iOS Production Build (.ipa)
```bash
eas build -p ios --profile production
```
