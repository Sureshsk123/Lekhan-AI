# Enterprise Hardware Automation Suite

## Overview
The Hardware Automation Suite validates the application's interactions with physical and emulated device capabilities, such as the Camera, Gallery, Permissions, Biometrics, and System states (Rotation, Network, Backgrounding). 

All interactions flow strictly through the `CompatibilityManager` and `FlowManager`. No raw native Appium calls are used directly within the test suites.

## Coverage Matrix
| Module | Validations |
|---|---|
| **Camera** | Open, Permissions, Capture, Retake, Cancel, Failure Recovery, Background During Capture |
| **Gallery** | Select Image, Cancel, Large/Small/Corrupted files |
| **OCR** | Capture Document, Read Gallery, Blurred Image, OCR Retry, Rotation |
| **Permissions** | Camera, Storage, Location (Allow/Deny/Permanent Deny/Recovery) |
| **File Picker** | Browse files, Select unsupported formats |
| **Rotation** | Portrait/Landscape toggling during critical flows (OCR, Upload) |
| **Backgrounding** | State persistence across OS background tasks |
| **Network** | Airplane Mode, WiFi toggle, Offline mode recovery |
| **Clipboard** | Copy/Paste system events |
| **Location/Biometric** | Mocking and graceful skipping for unsupported capabilities |
| **Recovery** | Self-healing flows for crashes, denial, or memory errors |

## Execution Flow
1. **Dependency Injection**: Each test suite initializes `CompatibilityManager` and `FlowManager`.
2. **Setup**: `resetApp()` is called before each test to ensure a clean state.
3. **Execution**: Business logic is delegated to `flowManager`. Hardware interrupts are triggered via `compatibilityManager`.
4. **Validation**: Asserts check for layout recovery, app state, and toast/snackbar messages.
5. **Teardown**: System states (like network or rotation) are restored in `afterEach()` blocks. If a test fails, a screenshot is captured.

## Recovery Logic (Self-Healing)
Hardware tests utilize `RetryUtility` extensively. If an action fails (e.g., Camera busy), the test will attempt to:
1. Capture screenshot and log metadata.
2. Background and foreground the app.
3. Restart the specific flow or trigger a soft reset.
4. Retry the assertion up to 3 times with backoff delays.

## Known Emulator Limitations
- **Camera Mocking**: Emulators often use a mock 3D scene. "Corrupted image" tests rely on ADB pushed files.
- **Biometrics**: Can only be tested on supported API levels (API 28+) using `executeShellCommand`. If unsupported, tests gracefully `skip()`.
- **Clipboard Sync**: Requires emulator settings to allow host-guest clipboard synchronization.

## CI/CD Recommendations
- Spin up parallel Android Emulators utilizing different AVD images to validate matrix.
- Ensure ADB access is granted to the test runner for `executeShellCommand` capabilities.
- Allocate at least 4GB of RAM per emulator to prevent OOM errors during OCR processing.
