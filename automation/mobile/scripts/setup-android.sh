#!/bin/bash
set -e
echo "Installing Android SDK Components for API Level: ${API_LEVEL}..."
yes | sdkmanager --licenses > /dev/null 2>&1 || true
sdkmanager "platform-tools" "platforms;android-${API_LEVEL}" "emulator" "system-images;android-${API_LEVEL};google_apis;x86_64" || true
