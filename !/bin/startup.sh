#!/bin/bash

# Navigate to the frontend directory
cd frontend

# Install Playwright dependencies
npx playwright install --with-deps

# Install Cypress dependencies
sudo apt-get update
sudo apt-get install -y xvfb libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 libxtst6 xauth xvfb
npx cypress install
npx cypress verify

# Return to the root directory
cd ..

# You can add any other startup commands here

echo "Startup script completed successfully"