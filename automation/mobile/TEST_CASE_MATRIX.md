# Enterprise Mobile App - Test Case Matrix

This matrix maps the required test coverage to the screens identified in the Test Inventory. It dictates the scope of the upcoming Mobile Test Suites.

## 1. Authentication (`Auth_Workflows.test.js`)
| ID | Title | Priority | Screen / POM | Workflow / Validation |
|----|-------|----------|--------------|-----------------------|
| `MOB_AUTH_01` | Successful Login | P0 | `LoginPage`, `DashboardPage` | Verify user navigates to Dashboard upon valid login. |
| `MOB_AUTH_02` | Invalid Credentials | P1 | `LoginPage` | Verify error toast/snackbar is displayed for invalid login. |
| `MOB_AUTH_03` | Registration Flow | P0 | `RegistrationPage` | Verify new user creation and auto-login transition. |
| `MOB_AUTH_04` | Password Recovery | P2 | `ForgotPasswordPage` | Verify reset link dispatched toast message. |

## 2. Navigation & Routing (`Navigation_Workflows.test.js`)
| ID | Title | Priority | Screen / POM | Workflow / Validation |
|----|-------|----------|--------------|-----------------------|
| `MOB_NAV_01` | Bottom Navigation | P1 | `DashboardPage`, `LessonsListPage` | Verify tapping bottom nav icons loads corresponding fragments. |
| `MOB_NAV_02` | Side Drawer Access | P2 | `SideDrawerComponent` | Verify hamburger menu opens drawer and navigates to Settings. |
| `MOB_NAV_03` | Device Back Button | P2 | App Wide | Verify OS hardware back button respects navigation stack. |

## 3. Hardware & Permissions (`Hardware_Workflows.test.js`)
| ID | Title | Priority | Screen / POM | Workflow / Validation |
|----|-------|----------|--------------|-----------------------|
| `MOB_HW_01` | Grant Camera Permission | P0 | `PermissionsDialog`, `CameraPage` | Verify OS dialog acceptance allows camera initialization. |
| `MOB_HW_02` | Deny Camera Permission | P1 | `PermissionsDialog`, `VisionOcrPage` | Verify graceful fallback/error state when permission is denied. |
| `MOB_HW_03` | Gallery Image Selection | P1 | `GalleryPage`, `VisionOcrPage` | Verify selecting a local image successfully passes data to OCR. |

## 4. Business Features & AI (`Business_Workflows.test.js`)
| ID | Title | Priority | Screen / POM | Workflow / Validation |
|----|-------|----------|--------------|-----------------------|
| `MOB_BIZ_01` | Complete Lesson | P0 | `LessonDetailPage`, `QuizPage` | Verify full transition from reading lesson to completing quiz. |
| `MOB_BIZ_02` | AI Tutor Chat | P0 | `AiTutorPage` | Verify typing a query returns a message bubble response. |
| `MOB_BIZ_03` | OCR Processing | P1 | `VisionOcrPage` | Verify full-screen loading state appears during image processing. |

## 5. UI & Accessibility (`UI_Workflows.test.js`)
| ID | Title | Priority | Screen / POM | Workflow / Validation |
|----|-------|----------|--------------|-----------------------|
| `MOB_UI_01` | Empty State Display | P2 | `LessonsListPage` | Verify empty state illustration displays when list data is 0. |
| `MOB_UI_02` | Pull to Refresh | P2 | `DashboardPage` | Verify swipe down gesture triggers data reload. |
| `MOB_UI_03` | Form Validation | P1 | `RegistrationPage` | Verify inline error messages for missing email formats. |
| `MOB_UI_04` | Logout Modal | P2 | `SettingsPage`, Dialog | Verify "Are you sure?" dialog before destroying session. |

## 6. System Interruptions (Mobile Specific)
| ID | Title | Priority | Screen / POM | Workflow / Validation |
|----|-------|----------|--------------|-----------------------|
| `MOB_SYS_01` | Network Disconnect | P1 | Global | Verify global offline toast appears when network drops. |
| `MOB_SYS_02` | Background App | P2 | Global | Verify app state is preserved when sent to background and resumed. |
