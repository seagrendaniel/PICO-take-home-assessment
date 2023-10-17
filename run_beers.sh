#!/bin/bash

# Check if node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js not installed. Please install Node.js to run javascript files"
    exit 1
fi

if [ $# -eq 0 ]; then
    echo "Using $0: Please pass a JS file to run as a second argument"
    exit 1
fi

js_file="$1"

if [ ! -f "$js_file" ]; then
    echo "File not found: $js_file"
    exit 1
fi

# Run file using node
node "$js_file"