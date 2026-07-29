# Enterprise Mobile App - Screen Flow Analysis

This document represents the navigational topology and logical user flows across the mobile application.

## 1. High-Level Application Flow

```mermaid
graph TD
    A([App Launch]) --> B{Is Session Active?}
    B -->|No| C[Splash Screen]
    B -->|Yes| D[Dashboard Screen]
    
    C --> E[Login Screen]
    E --> F[Registration Screen]
    E --> G[Forgot Password Screen]
    
    E -->|Success| D
    F -->|Success| D
```

## 2. Core Dashboard & Navigation Flow

```mermaid
graph TD
    A[Dashboard Screen] -->|Bottom Nav| B[Lessons List Screen]
    A -->|Bottom Nav| C[Profile Screen]
    A -->|Bottom Nav| D[AI Tutor Screen]
    
    A -->|Drawer Menu| E[Settings Screen]
    A -->|Search Icon| F[Global Search]
    
    E --> G([Logout])
```

## 3. Hardware / Vision OCR Flow
*Demonstrates mobile-specific permission and hardware flows.*

```mermaid
graph TD
    A[Vision OCR Screen] --> B{Select Input Method}
    B -->|Camera| C{Has Camera Permission?}
    B -->|Gallery| D{Has Storage Permission?}
    
    C -->|No| E[OS Permission Dialog]
    E -->|Allow| F[Camera View]
    E -->|Deny| A
    C -->|Yes| F
    
    D -->|No| G[OS Permission Dialog]
    G -->|Allow| H[Gallery Picker]
    G -->|Deny| A
    D -->|Yes| H
    
    F -->|Capture Image| I[Processing Loader]
    H -->|Select Image| I
    
    I --> J[OCR Results View]
```

## 4. Assessment Workflow

```mermaid
graph LR
    A[Lessons List] -->|Tap Lesson| B[Lesson Detail]
    B -->|Complete Content| C[Start Quiz]
    C -->|Submit Answer| D{Is Last Question?}
    D -->|No| C
    D -->|Yes| E[Quiz Results]
    E -->|Retry| C
    E -->|Continue| A
```

## Page Object Model (POM) Strategy
Based on the flow analysis above, the framework will implement the following inheritance tree for Page Objects in the next phase:

1. **`BasePage.js`** (Master parent for all pages)
2. **`GlobalNavigationComponent.js`** (Handles Bottom Nav, Drawer - Extended by pages that feature it)
3. **Domain Pages**: `LoginPage.js`, `DashboardPage.js`, `AiTutorPage.js`, `VisionOcrPage.js`, etc.
4. **Native Dialog Components**: `PermissionDialog.js` (Handles OS-level UIAutomator alerts).
