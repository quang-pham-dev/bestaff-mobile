#!/bin/bash

# Check if maestro is installed
if ! command -v maestro &> /dev/null; then
    echo "Maestro is not installed. Please install it first:"
    echo "curl -Ls \"https://get.maestro.mobile.dev\" | bash"
    exit 1
fi

# Run maestro tests
echo "Running Maestro E2E tests..."
maestro test e2e/flows "$@"
