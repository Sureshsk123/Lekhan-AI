# Enterprise Mobile App Analysis - Screen Inventory

This document provides a complete inventory of the mobile application's screens, components, and workflows. It serves as the architectural foundation for building the Mobile Page Object Model (POM).

## 1. Onboarding & Authentication
| Screen Name | Purpose | Entry Point | Exit Paths | UI Elements | Dependencies | POM Mapping |
|-------------|---------|-------------|------------|-------------|--------------|-------------|
| **Splash Screen** | App initialization | App Launch | Login, Dashboard | App Logo, Loader | None | `SplashPage` |
| **Login Screen** | User authentication | Splash / Logout | Dashboard, Registration, Forgot Password | Email Input, Password Input, Login Button, Social Auth | Auth API | `LoginPage` |
| **Registration Screen** | New account creation | Login Screen | Dashboard, Login | Name, Email, Password, Terms Checkbox, Register Button | Auth API | `RegistrationPage` |
| **Forgot Password** | Password recovery | Login Screen | Login Screen (Success/Cancel) | Email Input, Reset Button | Email Service | `ForgotPasswordPage` |

## 2. Main Navigation & Core Features
| Screen Name | Purpose | Entry Point | Exit Paths | UI Elements | Dependencies | POM Mapping |
|-------------|---------|-------------|------------|-------------|--------------|-------------|
| **Dashboard Screen** | Primary hub / Activity summary | Login | Any Tab (Lessons, Profile, Settings) | Bottom Nav, Widgets, Greeting | User Profile | `DashboardPage` |
| **Side Drawer** | Deep navigation links | Hamburger Icon | Settings, Support, Logout | Menu Items, Profile Avatar | None | `SideDrawerComponent` |
| **Global Search** | App-wide search | Search Icon (Top Bar) | Detail Pages | Search Bar, Recent List, Results | Search Index | `SearchComponent` |

## 3. Learning & Content Modules
| Screen Name | Purpose | Entry Point | Exit Paths | UI Elements | Dependencies | POM Mapping |
|-------------|---------|-------------|------------|-------------|--------------|-------------|
| **Lessons List Screen** | Browse available courses | Bottom Nav | Lesson Detail | Recycler View (List), Filters | Content API | `LessonsListPage` |
| **Lesson Detail Screen**| Consume content | Lessons List | Quiz, Lessons List | Video Player, Text Body, Next Button | Content API | `LessonDetailPage` |
| **Quiz Screen** | Assessment | Lesson Detail | Quiz Results | Radio Buttons, Timer, Submit | Quiz Engine | `QuizPage` |
| **Quiz Results** | Display score | Quiz Screen | Dashboard, Lessons List | Score Ring, Retry Button | None | `QuizResultsPage` |

## 4. Hardware & AI Integration (Mobile Specific)
| Screen Name | Purpose | Entry Point | Exit Paths | UI Elements | Dependencies | POM Mapping |
|-------------|---------|-------------|------------|-------------|--------------|-------------|
| **Camera View** | Capture documents/images | Vision OCR | Vision OCR (Image Data) | Shutter Button, Flash Toggle | Camera Permission | `CameraPage` |
| **Gallery Picker** | Select existing images | Vision OCR | Vision OCR (Image Data) | Image Grid, Select Button | Storage Permission | `GalleryPage` |
| **Vision OCR Screen** | Process image to text | Dashboard / Lessons | Camera, Gallery, Results | Upload Button, Loading State | OCR Service | `VisionOcrPage` |
| **AI Tutor Chat** | Interactive LLM Tutor | Dashboard | Dashboard | Chat bubbles, Input Field, Send Button | LLM API | `AiTutorPage` |

## 5. Account & Settings
| Screen Name | Purpose | Entry Point | Exit Paths | UI Elements | Dependencies | POM Mapping |
|-------------|---------|-------------|------------|-------------|--------------|-------------|
| **Profile Screen** | View user data & stats | Bottom Nav / Drawer | Edit Profile, Settings | Avatar, Stats Grid, Edit Button | User API | `ProfilePage` |
| **Settings Screen** | App preferences | Drawer | Profile, Login (Logout) | Toggles (Dark Mode, Notifications), Logout | Local Storage | `SettingsPage` |
| **Permissions Modal** | Request device access | Camera / Gallery triggers | Calling Screen | Native OS Allow/Deny Dialog | OS System | `PermissionsDialog` |

## 6. Global States & Components
- **Error Pages**: E.g., Network Timeout, 404. Contains an error message and a "Retry" button.
- **Empty States**: Displayed in lists (e.g., empty notifications). Contains an illustration and a CTA.
- **Loading States**: Shimmer effects or full-screen spinners overlaying content.
- **Dialogs / Modals**: App-level confirmation alerts (e.g., "Are you sure you want to logout?").
- **Toasts / Snackbars**: Transient success/error messages at the bottom of the screen.
