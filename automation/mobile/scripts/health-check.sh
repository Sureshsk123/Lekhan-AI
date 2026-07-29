#!/bin/bash
echo "Performing Health Check..."
devices=$(adb devices | grep -w "device")
if [ -z "$devices" ]; then
    echo "ERROR: No devices attached."
    adb kill-server
    adb start-server
    exit 1
fi
echo "Devices OK: $devices"
