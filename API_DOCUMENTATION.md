# LangSphere AI — REST API Documentation

**Base URL:** `http://localhost:5005/api/v1`  
**Authentication:** Bearer Token (`Authorization: Bearer <JWT_TOKEN>`)

---

## 🔐 1. Authentication Endpoints (`/auth`)

### `POST /auth/register`
Register a new user account.
- **Access:** Public
- **Allowed Email Domains:** `@gmail.com`, `@saveetha.com`
- **Request Body:**
  ```json
  {
    "fullName": "John Doe",
    "email": "john123@saveetha.com",
    "password": "Password123!"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "status": "success",
    "data": {
      "user": { "id": "uuid", "email": "john123@saveetha.com", "fullName": "John Doe" },
      "token": "eyJhbGciOi..."
    }
  }
  ```

### `POST /auth/login`
Authenticate existing user.
- **Access:** Public
- **Request Body:**
  ```json
  {
    "email": "john123@saveetha.com",
    "password": "Password123!"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "status": "success",
    "data": {
      "user": { "id": "uuid", "email": "john123@saveetha.com", "xp": 150, "coins": 50 },
      "token": "eyJhbGciOi..."
    }
  }
  ```

### `GET /auth/me`
Fetch authenticated user profile.
- **Access:** Protected (Bearer Token)
- **Response (200 OK):** User object containing profile details, xp, coins, streak, avatarUrl, frameId, title.

---

## 📚 2. Lessons & Progression Endpoints (`/lessons`)

### `GET /lessons/:languageCode`
Fetch entire curriculum modules and lessons for a language.
- **Access:** Public
- **Parameters:** `languageCode` (`en`, `ta`, `hi`, `te`)
- **Response (200 OK):** List of modules containing topics and lessons.

### `GET /lessons/details/:lessonId`
Fetch full content details of a specific lesson (vocab, grammar, examples, linked quiz).
- **Access:** Public
- **Response (200 OK):** Lesson object with exercises array.

### `POST /lessons/complete/:lessonId`
Mark a lesson as completed and claim XP/Coin rewards.
- **Access:** Protected (Bearer Token)
- **Response (200 OK):**
  ```json
  {
    "status": "success",
    "data": {
      "xpEarned": 15,
      "coinsEarned": 7,
      "lessonId": "uuid"
    }
  }
  ```

### `GET /lessons/progress/:languageCode?`
Fetch user's lesson progress and weekly activity.
- **Access:** Protected (Bearer Token)
- **Response (200 OK):** List of completed lessons, total count, XP earned, and weekly activity array.

---

## 🧠 3. Quiz Endpoints (`/quizzes`)

### `GET /quizzes/:quizId`
Fetch quiz questions and options (options shuffled, correct answers masked).
- **Access:** Public

### `GET /quizzes/lesson/:lessonId`
Fetch quiz linked to a specific lesson.
- **Access:** Public

### `POST /quizzes/:quizId/submit`
Submit quiz answers for evaluation.
- **Access:** Protected (Bearer Token)
- **Request Body:**
  ```json
  {
    "answers": [
      { "questionId": "q-uuid-1", "answerId": "a-uuid-1" }
    ]
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "status": "success",
    "data": {
      "attemptId": "uuid",
      "score": 100,
      "passed": true,
      "correctCount": 2,
      "totalQuestions": 2,
      "xpEarned": 50,
      "coinsEarned": 25,
      "questionResults": [...]
    }
  }
  ```

### `GET /quizzes/history`
Fetch recent quiz attempts for the authenticated user.
- **Access:** Protected (Bearer Token)

---

## 📖 4. Cultural Stories Endpoints (`/stories`)

### `GET /stories?languageCode=ta&level=BEGINNER`
Fetch storybooks matching language and optional level filter.
- **Access:** Public

### `GET /stories/:id`
Fetch full story details with pages and translations.
- **Access:** Public

---

## 🛍️ 5. Shop & Inventory Endpoints (`/shop`)

### `GET /shop/catalog?category=themes`
Fetch shop catalog items by category (`themes`, `avatars`, `frames`, `titles`, `boosters`, `badges`).
- **Access:** Public

### `POST /shop/purchase`
Purchase an item using earned Coins.
- **Access:** Protected (Bearer Token)
- **Request Body:** `{ "itemId": "reward-uuid" }`

### `GET /shop/inventory`
Fetch owned items for the logged-in user.
- **Access:** Protected (Bearer Token)

### `POST /shop/equip`
Equip an owned item (avatar, frame, title).
- **Access:** Protected (Bearer Token)
- **Request Body:** `{ "itemId": "reward-uuid" }`

---

## 📊 6. Dashboard Endpoints (`/dashboard`)

### `GET /dashboard`
Fetch full analytics dashboard metrics for the authenticated user.
- **Access:** Protected (Bearer Token)
- **Response Data:** User stats, XP metrics, 7-day heatmap, recommended lessons, recent activity, and quiz history.

---

## 🤖 7. AI Services Endpoints

### `POST /ai/tutor/chat`
Send message to AI Tutor and receive target language response.
- **Access:** Protected (Bearer Token)
- **Request Body:** `{ "languageCode": "ta", "message": "வணக்கம்!", "sessionId": "optional-uuid" }`

### `POST /handwriting/evaluate`
Evaluate handwritten character/word canvas drawing.
- **Access:** Protected (Bearer Token)
- **Request Body:** `{ "imageBase64": "data:image/png;base64,...", "expectedText": "அ" }`

### `POST /ocr/process`
Extract text from an uploaded image.
- **Access:** Protected (Bearer Token)
- **Request Body:** `{ "imageBase64": "base64-data...", "mimeType": "image/png" }`
