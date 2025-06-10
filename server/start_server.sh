#!/bin/bash
SCRIPT_DIR="$(dirname -- "$0")" 

if [ -z "$1" ]; then
  echo "Usage: $0 dev, testDev or testDevClean"
  exit 1
fi

nohup npm --prefix "$SCRIPT_DIR" run "$1" > /dev/null 2>&1 &
echo "Apollo server started in background."
exit 0