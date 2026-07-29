# Operations Guide

## Managing Datasets
When the QA environment database is wiped, the `automation/mobile/data/users/validUsers.json` file must be updated to match the new seed DB state.

## Modifying CI Matrix
To test a new Android API level, edit `.github/workflows/enterprise-platform.yml` and append `35` to the `api-level` matrix. The `setup-android.sh` script will dynamically install it.
