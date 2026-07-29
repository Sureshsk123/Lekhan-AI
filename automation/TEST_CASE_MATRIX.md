# Selenium E2E Automation - Test Case Matrix

This matrix maps the requirements of the Selenium framework specification to the actual application pages and identifies any gaps where the application lacks functionality.

## Test Case Mapping Matrix

| Specification Requirement | Target Page / Route | Mapped Scenario | Automation Feasibility | Identified Gaps |
|---|---|---|---|---|
| User Authentication | `/login`, `/signup`, `/forgot-password` | Login, Registration, Recovery flows | High | None. Auth routes and forms are well defined. |
| Dashboard Functionality | `/dashboard`, `/parent-dashboard`, `/admin` | Verify widgets, graphs, role-based views | High | None. Distinct dashboards exist for different roles. |
| Course / Lesson Navigation | `/lessons/:language?`, `/lesson/:id` | Browse and view lesson content | High | None. Data is dynamic but structure is static. |
| Gamification & Economics | `/shop`, `/inventory`, `/leaderboard` | Purchase items, equip items, view rankings | High | None. Shop and Inventory use clear UI interactions. |
| Form Validation | Various (Auth, Settings, Parent Link) | Verify required fields, error messages | High | Relies heavily on HTML5 validation and toasts. Automation must capture toasts. |
| AI Interaction | `/ai-tutor` | Send message, receive AI response | Medium | Responses are asynchronous; wait strategies needed to detect AI replies. |
| Multimedia & Hardware | `/handwriting/:language?`, `/vision-ocr` | Canvas drawing, file uploads | Low/Medium | Canvas interaction requires advanced Selenium Actions (click and hold, move by offset). OCR requires `<input type="file">` interaction, which is feasible. |

## Identified Application Gaps (Missing Functionality)
1. **Accessibility Identifiers:** Many buttons, forms, and input fields currently rely on CSS classes rather than robust `id` or `data-testid` attributes. This could make page objects brittle.
2. **Clear Logout Flow Context:** Logout functionality exists but is embedded in a global layout or floating menu, rather than a dedicated `/logout` route or prominent button in all contexts.
3. **Empty States:** Scenarios where a user has 0 lessons, 0 XP, or 0 items in inventory may not have clear empty state designs in the DOM, complicating test assertions.

## Conclusion
The application is generally well-structured for Selenium E2E automation. The primary focus for the framework will be handling asynchronous states (loading spinners) and temporary UI elements (Toasts, Modals) using the `WaitUtility` implemented in the foundation.
