#!/bin/bash
set -e
echo "Installing Android SDK Components..."
yes | sdkmanager --licenses > /dev/null
sdkmanager "platform-tools" "platforms;android-${API_LEVEL}" "emulator" "system-images;android-${API_LEVEL};google_apis;x86_64"
