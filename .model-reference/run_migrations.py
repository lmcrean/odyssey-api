#!/usr/bin/env python
import os
import django
from django.core.management import execute_from_command_line

# Set environment variables - these should be set as environment variables instead
# os.environ['DATABASE_URL'] = 'your_database_url_here'  # Set this as environment variable instead
os.environ['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'default-secret-key')
# Remove hardcoded superuser credentials - these should be set via environment variables
# os.environ['DJANGO_SUPERUSER_USERNAME'] = 'admin'
# os.environ['DJANGO_SUPERUSER_EMAIL'] = 'user@example.com' 
# os.environ['DJANGO_SUPERUSER_PASSWORD'] = 'secure_password'

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'drf_api.settings')
django.setup()

if __name__ == '__main__':
    print("🚀 Running Django migrations on production database...")
    
    try:
        # Run migrations
        execute_from_command_line(['run_migrations.py', 'migrate', '--verbosity=2'])
        print("✅ Migrations completed successfully!")
        
        # Create superuser only if environment variables are set
        username = os.environ.get('DJANGO_SUPERUSER_USERNAME')
        email = os.environ.get('DJANGO_SUPERUSER_EMAIL')
        password = os.environ.get('DJANGO_SUPERUSER_PASSWORD')
        
        if username and email and password:
            from django.contrib.auth.models import User
            if not User.objects.filter(username=username).exists():
                print("👤 Creating superuser...")
                User.objects.create_superuser(
                    username=username,
                    email=email,
                    password=password
                )
                print("✅ Superuser created!")
            else:
                print("ℹ️  Superuser already exists!")
        else:
            print("ℹ️  Skipping superuser creation - environment variables not set")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        print("Please check your database connection and try again.") 