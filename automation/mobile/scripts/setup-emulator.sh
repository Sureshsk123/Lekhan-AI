#!/bin/bash
set -e
echo "Creating Android Emulator..."
echo "no" | avdmanager create avd -n TestEmulator -k "system-images;android-${API_LEVEL};google_apis;x86_64" --force
echo "Starting Emulator..."
emulator -avd TestEmulator -no-window -no-snapshot -no-audio -camera-back none &
