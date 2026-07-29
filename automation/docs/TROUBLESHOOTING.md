# Troubleshooting

### "ADB Device Not Found"
The Github Actions Mac runner may have stalled during hardware acceleration boot. Ensure `wait-for-device.sh` is explicitly checking `sys.boot_completed`.

### "Schema Validation Failed"
A developer altered a JSON file but violated the required fields (e.g., misspelled `password`). Check the exact stack trace thrown by `DataValidator.js`.
