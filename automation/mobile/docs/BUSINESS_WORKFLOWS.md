# Enterprise Business Workflow Automation Suite

## Overview
The Business Workflow Automation Suite is designed to validate complex, multi-step user journeys from end-to-end. It mimics real-world user interactions and ensures that independent systems (Auth, Learning, Rewards, Hardware) orchestrate seamlessly together.

All workflows rely exclusively on the **FlowManager** and **CompatibilityManager**. No tests directly invoke raw native Appium calls or UI selectors.

## Workflow Matrix & Coverage
| Suite | Validations Covered |
|---|---|
| **User Onboarding** | Registration, Email Verification (Mocked), Profile Setup, First Lesson |
| **Lesson Completion** | Browsing, Resuming, State Saving, Completion |
| **Quiz Workflow** | Leaderboard Updates, Score Calculations, Question Progression |
| **OCR Workflow** | Error Recovery, Validation loops, Hardware Integrations |
| **Handwriting Workflow** | Touch Drawing validation |
| **AI Conversation** | Network Interruptions, Multi-turn interactions |
| **Rewards System** | Earning Points, Redeeming Items, Inventory Checks |
| **Parent Dashboard** | Access Control, Viewing History |
| **Settings & Profile** | Deep State Persistence (Across Restart) |
| **Search** | Filter states, Recent history |
| **Offline Reliability** | Airplane mode sync, local caching |
| **Session Recovery** | App Crashing, Backgrounding |
| **E2E Regression** | Complete monolithic happy-path scenario (Reg -> Lesson -> Quiz -> AI -> Reward -> Logout) |

## Dependencies
Workflows are designed statelessly where possible, but deep learning flows depend on successful authentication. Tests handle this via `FlowManager.authFlow` before entering the critical path. Parallel execution is fully supported as no singleton locks exist.

## Recovery Paths (Self-Healing)
Tests employ `RetryUtility` and `CompatibilityManager` to combat real-world instability:
1. **Network Flutter:** Automatically toggles and waits for Sync states.
2. **Crash Recovery:** Tests validate persistence across `terminate` and `activate` cycles.
3. **Hardware Halts:** OCR delays are wrapped in intelligent exponential backoffs.

## Known Limitations
- The monolithic `EndToEndRegression.test.js` provides realistic coverage but carries high execution time and debugging complexity.
- Email Verification is currently mocked and skips SMS/Email inbox scraping for execution velocity.

## Future Extensions
- Integrate Appium multi-device execution to test real-time chat between users.
- Add Performance tracing (Battery/CPU) logging into the E2E script.
