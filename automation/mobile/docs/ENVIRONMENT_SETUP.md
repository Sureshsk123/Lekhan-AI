# Enterprise Environment Setup

This document outlines the requisite software, environment variables, and verification flows required to successfully execute the Enterprise Mobile Automation Framework using Appium 2.x and WebdriverIO.

## Required Software
The following dependencies must be installed globally on the host machine executing the test suite:
- **Node.js**: LTS version (18.x or 20.x). Verify via `node -v`.
- **Java Development Kit (JDK)**: Version 11 or 17. Verify via `java -version`.
- **Android Studio / SDK**: Required for ADB, AAPT, and Emulators.
- **Appium 2.x**: Installed globally via `npm install -g appium`.
- **UiAutomator2 Driver**: Installed via `appium driver install uiautomator2`.

## Environment Variables
The automated `EnvironmentVerifier` strict-checks for the existence of the following environment path:
- `ANDROID_HOME` or `ANDROID_SDK_ROOT`: Must point to the Android SDK installation directory.
  - *macOS example*: `export ANDROID_HOME=$HOME/Library/Android/sdk`
- Additionally, ensure `$ANDROID_HOME/platform-tools` and `$ANDROID_HOME/build-tools/xx.x.x` are exported to your `$PATH`.

## Verification Process
Before any Appium session is bound in `BaseTest.js`, the framework invokes the `EnvironmentVerifier`.

1. **Dependency Checker**: Runs native shell commands to validate Node, Java, ADB, AAPT, and Appium exist.
2. **System Diagnostics**: Gathers host metrics (Available RAM, Disk, OS) and probes the connected device/emulator via `adb shell getprop` to validate Android Versions and Boot Completion (`sys.boot_completed`).
3. **Console Report**: A formatted matrix is printed to the console:
   ```text
   Node.js ........ PASS
   Java ........... PASS
   ADB ............ PASS
   Appium ......... PASS
   Android SDK .... PASS
   ```
4. **Fail-Fast**: If a critical dependency is marked `FAILED` (e.g., `Java not installed`, `ADB not found`, `Device unauthorized`), the test execution is aggressively halted before WebdriverIO throws a timeout exception.

## Troubleshooting Common Errors

- **`ANDROID_HOME missing`**:
  - The Android SDK path is not mapped to your environment variables. Open `~/.zshrc` or `~/.bash_profile` and export it manually.
- **`Device unauthorized`**:
  - The physical device or emulator has not accepted the RSA key prompt from your machine. Open the device screen and click "Always allow from this computer".
- **`AAPT not found`**:
  - `aapt` is used by the `APKMetadata` module. Ensure the `build-tools` folder inside your Android SDK is explicitly added to your `$PATH`.
- **`Appium FAILED`**:
  - You likely missed the global Appium installation. Run `npm i -g appium`.
