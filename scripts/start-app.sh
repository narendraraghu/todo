#!/bin/bash

# Exit on error
set -e

# Go to project root
cd "$(dirname "$0")/.."

echo "Installing root dependencies..."
npm install

echo "Installing client dependencies..."
cd client && npm install

cd ../server
echo "Installing server dependencies..."
npm install

cd ..
echo "Starting client and server..."
npm start 