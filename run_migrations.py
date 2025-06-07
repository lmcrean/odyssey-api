#!/usr/bin/env python
import os
import django
from django.core.management import execute_from_command_line

# Set environment variables for Neon database
os.environ['DATABASE_URL'] = 'postgresql://neondb_owner:npg_4ql0vUgzxWQD@ep-odd-grass-abuazo3s-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require'
os.environ['SECRET_KEY'] = 'Qwerqwer1*'
os.environ['DJANGO_SUPERUSER_USERNAME'] = 'admin'
os.environ['DJANGO_SUPERUSER_EMAIL'] = 'lmcrean@gmail.com'
os.environ['DJANGO_SUPERUSER_PASSWORD'] = 'Qwerqwer1*'

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'drf_api.settings')
django.setup()

if __name__ == '__main__':
    print("🚀 Running Django migrations on Neon database...")
    
    try:
        # Run migrations
        execute_from_command_line(['run_migrations.py', 'migrate', '--verbosity=2'])
        print("✅ Migrations completed successfully!")
        
        # Create superuser
        from django.contrib.auth.models import User
        if not User.objects.filter(username='admin').exists():
            print("👤 Creating superuser...")
            User.objects.create_superuser(
                username='admin',
                email='lmcrean@gmail.com',
                password='Qwerqwer1*'
            )
            print("✅ Superuser created!")
        else:
            print("ℹ️  Superuser already exists!")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        print("Please check your database connection and try again.") 