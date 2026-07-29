# APK Management Architecture

This document describes the Enterprise APK Management module built to fully abstract the lifecycle of Android application packages during automated testing. The system eliminates hardcoded paths and intelligently resolves APKs based on the execution environment.

## Architecture

The APK Management layer consists of three isolated utilities ensuring a thread-safe execution flow for parallel compatibility.

1. **`APKMetadata.js`**: Relies on the Android SDK `aapt` command-line tool (specifically `aapt dump badging`) to programmatically extract the application package name, internal version code, external version name, and file size stats.
2. **`APKValidator.js`**: Executes pre-installation checks to prevent fatal Appium server crashes. Validates file existence, `.apk` extensions, >0 byte sizes, and read permissions.
3. **`APKManager.js`**: Orchestrates the Appium `driver` lifecycle. Evaluates the installed version via `adb shell dumpsys` against the local APK version to determine if an installation/update is actually required, drastically reducing execution time.

## Folder Structure

```text
automation/mobile/
├── apk/
│   ├── debug/          # Target debug builds
│   ├── release/        # Target production builds
│   ├── staging/        # Target staging builds
│   ├── qa/             # Target QA builds
│   └── archive/        # Deprecated/historical builds
├── config/
│   └── config.json     # Resolves environment mapping
├── docs/
│   └── APK_MANAGEMENT.md
└── utilities/
    ├── APKManager.js
    ├── APKMetadata.js
    └── APKValidator.js
```

## Configuration Examples

The `config.json` inside the mobile framework dynamically dictates which APK the framework selects.

```json
{
  "environment": "qa",
  "apk": {
      "debug": "./apk/debug/app-debug.apk",
      "release": "./apk/release/app-release.apk",
      "staging": "./apk/staging/app-staging.apk",
      "qa": "./apk/qa/app-qa.apk"
  }
}
```

When `APKManager.findLatestAPK()` is invoked, it inherently reads `"environment": "qa"` and returns the resolved absolute path for `./apk/qa/app-qa.apk`.

## Installation Flow

When `APKManager.installAPK(driver)` is called:
1. **Resolution**: `findLatestAPK()` dynamically resolves the environment-specific APK path.
2. **Validation**: `APKValidator` confirms the file is structurally sound and accessible.
3. **Metadata Extraction**: `APKMetadata` determines the target `packageName` and `versionName`.
4. **State Check**: `isInstalled()` queries the emulator/device.
5. **Comparison**: If installed, `dumpsys package` pulls the current version.
6. **Execution**:
   - If `versionName` matches perfectly: *Skip Installation*.
   - If `versionName` differs: *Uninstall old application, then Install new APK*.

## Lifecycle Methods

All operations are bound to the current `driver` session, completely eliminating global mutable state:
- `installAPK(driver)`
- `uninstallAPK(driver, packageName)`
- `reinstallAPK(driver)`
- `launchApp(driver, packageName)`
- `terminateApp(driver, packageName)`
- `clearAppData(driver, packageName)`
- `resetApplication(driver, packageName)`
- `isInstalled(driver, packageName)`

## Troubleshooting

- **`aapt` not found**: Ensure your system path (`$PATH`) includes `$ANDROID_HOME/build-tools/xx.x.x/`. The `APKMetadata` module will gracefully fail over to reporting "Unknown" attributes, but `aapt` is recommended for full visibility.
- **Dumpsys errors**: If `adb shell dumpsys` fails to return the installed version, verify the device is properly connected and authorized via `adb devices`.

## Future Extension Points
The extracted metadata payloads from `installAPK()` are structured intentionally so that they can be directly appended into Mochawesome context payloads or ExcelJS metadata sheets in a future reporting sprint.
