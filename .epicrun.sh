#!/bin/bash
export GEMKEY="$1"
node tools/hi-translate.js --collection ramayana    > .hilog/ep-ram.log 2>&1 &
node tools/hi-translate.js --collection mahabharata > .hilog/ep-mah.log 2>&1 &
wait
echo EPICS DONE
