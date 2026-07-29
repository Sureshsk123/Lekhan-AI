#!/bin/bash
echo "Generating Job Summary..."
json_file="automation/mobile/reports/Report.json"
if [ -f "$json_file" ]; then
    passed=$(cat $json_file | jq '.passed')
    failed=$(cat $json_file | jq '.failed')
    duration=$(cat $json_file | jq '.totalDurationMs')
    echo "### Enterprise Automation Summary 🚀" >> $GITHUB_STEP_SUMMARY
    echo "- **Passed**: $passed ✅" >> $GITHUB_STEP_SUMMARY
    echo "- **Failed**: $failed ❌" >> $GITHUB_STEP_SUMMARY
    echo "- **Duration**: $((duration/1000))s ⏱" >> $GITHUB_STEP_SUMMARY
else
    echo "### Report Data Not Found ⚠️" >> $GITHUB_STEP_SUMMARY
fi
