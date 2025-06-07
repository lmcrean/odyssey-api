#!/bin/bash

echo "Building Django project for Vercel..."

# Install dependencies
pip install -r requirements.txt

# Collect static files
python manage.py collectstatic --noinput

# Run migrations
python manage.py migrate --noinput

echo "Build completed successfully!" 