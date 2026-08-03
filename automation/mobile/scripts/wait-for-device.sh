#!/bin/bash
echo "Waiting for emulator to boot..."
boot_completed="0"
while [ "$boot_completed" != "1" ]; do
    sleep 5
    boot_completed=$(adb shell getprop sys.boot_completed 2>&1 | tr -d '\r')
    echo "Boot status: $boot_completed"
done
adb shell settings put global window_animation_scale 0.0
adb shell settings put global transition_animation_scale 0.0
adb shell settings put global animator_duration_scale 0.0
echo "Emulator fully booted and animations disabled."
