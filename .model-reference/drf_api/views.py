from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.core.management import call_command
from django.http import JsonResponse
import os


@api_view()
def root_route(request):
    return Response({
        "message": "Welcome to my drf API!"
    })


# dj-rest-auth logout view - simplified for Bearer token approach
@api_view(['POST'])
def logout_route(request):
    """
    Logout route for Bearer token authentication.
    Since tokens are stored in localStorage on the frontend,
    the actual logout logic (clearing tokens) happens on the client side.
    This endpoint simply returns a successful response.
    """
    return Response({'detail': 'Successfully logged out.'}, status=200)


@api_view(['POST'])
@permission_classes([AllowAny])
def setup_database(request):
    """
    One-time setup endpoint to run migrations in production.
    This should only be called once after deployment.
    """
    # Only allow this in production/Vercel environment
    if not os.environ.get('VERCEL_ENV'):
        return JsonResponse({'error': 'This endpoint is only available in production'}, status=403)
    
    try:
        # Run migrations
        call_command('migrate', verbosity=1, interactive=False)
        
        return JsonResponse({
            'success': True,
            'message': 'Database setup completed successfully'
        })
    except Exception as e:
        return JsonResponse({
            'error': f'Database setup failed: {str(e)}'
        }, status=500)
