import os
import django
from django.core.management import execute_from_command_line
from django.http import JsonResponse

# Django setup
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'drf_api.settings')
django.setup()

def handler(request):
    """Vercel function to run Django migrations"""
    try:
        # Run migrations
        execute_from_command_line(['migrate.py', 'migrate', '--verbosity=2'])
        
        # Create superuser if environment variables are set
        username = os.environ.get('DJANGO_SUPERUSER_USERNAME')
        email = os.environ.get('DJANGO_SUPERUSER_EMAIL') 
        password = os.environ.get('DJANGO_SUPERUSER_PASSWORD')
        
        if username and email and password:
            from django.contrib.auth.models import User
            if not User.objects.filter(username=username).exists():
                User.objects.create_superuser(
                    username=username,
                    email=email,
                    password=password
                )
                return JsonResponse({
                    'status': 'success',
                    'message': 'Migrations completed and superuser created!'
                })
            else:
                return JsonResponse({
                    'status': 'success', 
                    'message': 'Migrations completed! Superuser already exists.'
                })
        else:
            return JsonResponse({
                'status': 'success',
                'message': 'Migrations completed!'
            })
            
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': f'Migration failed: {str(e)}'
        }) 