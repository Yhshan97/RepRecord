#!/bin/bash

# Set the paths
OUTPUT_DIR="openApi/generated-output"
SPEC_PATH="../openapi.yaml"
MODEL_DIR="../../src/model"
API_DIR="../../src/api"

# Create a temporary directory for generated files
mkdir -p "$OUTPUT_DIR"
pushd "$OUTPUT_DIR" > /dev/null || { echo "Failed to return to previous directory. Exiting."; exit 1; }

# Generate the code using OpenAPI Generator
echo "Generating code from OpenAPI specification..."
npx openapi-generator-cli generate -i "$SPEC_PATH" -g typescript-node -o . \
--template-dir ../templates \
--additional-properties=supportsES6=true

# Check if the generation was successful
if [ $? -ne 0 ]; then
  echo "Error generating code. Exiting."
  exit 1
fi

# Clear out the target directories
echo "Clearing out the target directories..."
rm -rf "$MODEL_DIR"/*
rm -rf "$API_DIR"/*

# Copy the generated files into the target directories
echo "Copying generated files to src/model and src/api..."
cp -r model/* "$MODEL_DIR"/
cp -r api/* "$API_DIR"/

# Clean up the temporary directory
popd > /dev/null || { echo "Failed to return to previous directory. Exiting."; exit 1; }

rm -rf "$OUTPUT_DIR"

echo "Generation and copy completed successfully."
