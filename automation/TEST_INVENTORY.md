# Selenium E2E Automation - Test Inventory

This document provides a comprehensive analysis of the Lekhan AI React application to identify components for the Selenium E2E Automation Framework.

## Modules Overview

### 1. Authentication Module
| Route | Page Component | Forms / Inputs | Description | Required POM |
|---|---|---|---|---|
| `/login` | `LoginPage.jsx` / `Login.jsx` | Email, Password, Submit Button | User login page | `LoginPage` |
| `/signup` | `RegisterPage.jsx` / `Signup.jsx` | Name, Email, Password, Submit Button | New user registration | `RegisterPage` |
| `/forgot-password` | `ForgotPasswordPage.jsx` | Email, Submit Button | Password recovery | `ForgotPasswordPage` |

**Required Test Cases:**
- TC_AUTH_01: Verify successful login with valid credentials.
- TC_AUTH_02: Verify error toast on invalid login.
- TC_AUTH_03: Verify successful registration.
- TC_AUTH_04: Verify password recovery flow.

---

### 2. Dashboard Module
| Route | Page Component | UI Components | Description | Required POM |
|---|---|---|---|---|
| `/dashboard` | `SmartDashboardPage.jsx` | Navigation, Widgets, Buttons | Primary student dashboard (Protected) | `DashboardPage` |
| `/parent-dashboard` | `ParentDashboardPage.jsx` | Form (Link Child), Tables, Charts | Parent analytics and control | `ParentDashboardPage` |
| `/admin` | `AdminDashboardPage.jsx` | Tables, Action Buttons | Admin management dashboard | `AdminDashboardPage` |

**Required Test Cases:**
- TC_DASH_01: Verify dashboard widgets load correctly for Student.
- TC_DASH_02: Verify Parent can link a child account.
- TC_DASH_03: Verify Admin can view system analytics (Tables).

---

### 3. Learning Modules
| Route | Page Component | UI Components | Description | Required POM |
|---|---|---|---|---|
| `/lessons/:language?` | `LessonsListPage.jsx` | Cards, Buttons, Dropdowns | List of available lessons | `LessonsListPage` |
| `/lesson/:id` | `LessonDetailPage.jsx` | Content Viewer, Next/Prev Buttons | Individual lesson player | `LessonDetailPage` |
| `/ai-tutor` | `AiTutorPage.jsx` | Chat Input Form, Message List, Mic Button | Interactive AI tutor | `AiTutorPage` |
| `/handwriting/:language?` | `HandwritingCanvasPage.jsx` | Canvas, Clear/Submit Buttons | Handwriting recognition | `HandwritingPage` |
| `/vision-ocr` | `VisionOcrPage.jsx` | File Upload, Modals | Image to text OCR scanner | `OcrPage` |

**Required Test Cases:**
- TC_LEARN_01: Verify navigation to a specific lesson.
- TC_LEARN_02: Verify AI Tutor chat sends and receives messages.
- TC_LEARN_03: Verify Handwriting canvas accepts input and clears.
- TC_LEARN_04: Verify OCR file upload triggers processing.

---

### 4. Assessment Module
| Route | Page Component | UI Components | Description | Required POM |
|---|---|---|---|---|
| `/quiz/:lessonId?` | `QuizPage.jsx` / `QuizEngine.jsx` | Radio Buttons, Submit Button, Timer | Quiz execution engine | `QuizPage` |
| `/quiz-results` | `QuizResultsPage.jsx` | Score display, Retry Button | Quiz score summary | `QuizResultsPage` |

**Required Test Cases:**
- TC_QUIZ_01: Verify user can complete a quiz.
- TC_QUIZ_02: Verify quiz results calculate correctly.

---

### 5. Gamification & Store Module
| Route | Page Component | UI Components | Description | Required POM |
|---|---|---|---|---|
| `/shop` | `ShopPage.jsx` / `EpicStore.jsx` | Item Cards, Buy Buttons, Modals (Confirm) | Virtual store for XP | `ShopPage` |
| `/inventory` | `InventoryPage.jsx` | Grid, Item Cards, Equip Buttons | User's purchased items | `InventoryPage` |
| `/leaderboard` | `LeaderboardsPage.jsx` | Table, Tabs | Global and local rankings | `LeaderboardPage` |

**Required Test Cases:**
- TC_GAME_01: Verify user can purchase an item if XP is sufficient.
- TC_GAME_02: Verify purchased items appear in Inventory.
- TC_GAME_03: Verify Leaderboard table sorting.

---

### 6. Settings & Global Components
| Route | Page Component | UI Components | Description | Required POM |
|---|---|---|---|---|
| `/settings` | `SettingsPage.jsx` | Form (Profile Update), Toggles (Theme) | User settings and preferences | `SettingsPage` |
| `/search` | `GlobalSearchPage.jsx` | Search Bar, Result List | Global application search | `SearchPage` |
| N/A | `NotificationCenterPage` | Toasts, Notification List | Global notifications | `GlobalNavPage` |

**Required Test Cases:**
- TC_SET_01: Verify profile update form saves correctly.
- TC_NAV_01: Verify global search returns valid results.
- TC_NAV_02: Verify navigation menu routes to correct pages.

## Common Reusable Components Identified
- **Modals:** Used in `StoriesPage` (generate story form), `ShopPage` (purchase confirmation), `VisionOcrPage` (upload errors).
- **Toasts:** Used extensively across the app via `NotificationContext` for success/error alerts.
- **Forms:** standard `<form onSubmit={...}>` used heavily in Auth, Settings, and Parent Linking.
- **Tables:** Used in `AnalyticsDashboard`, `ParentDashboard`, and `LeaderboardsPage`.
