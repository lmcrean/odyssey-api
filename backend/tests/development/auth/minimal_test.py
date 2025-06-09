#!/usr/bin/env python
import os
import sys
import django
from pathlib import Path

# Setup Django environment
sys.path.insert(0, str(Path(__file__).parent.parent.parent.parent))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'drf_api.settings')
os.environ['DEV'] = '1'  # Use SQLite

django.setup()

from django.test import TestCase, Client
from django.contrib.auth.models import User
from django.urls import reverse
import json

def test_authentication():
    """Test authentication directly using Django test client"""
    
    print("🔍 Testing authentication with Django test client...")
    
    client = Client()
    
    # Create test user data
    user_data = {
        'username': 'testuser123',
        'password1': 'TestPassword123!',
        'password2': 'TestPassword123!'
    }
    
    # Test registration
    print("\n1. Testing registration...")
    registration_url = '/dj-rest-auth/registration/'
    response = client.post(
        registration_url, 
        data=json.dumps(user_data),
        content_type='application/json'
    )
    
    print(f"Registration status: {response.status_code}")
    print(f"Registration response: {response.content.decode()[:500]}...")
    
    if response.status_code == 201:
        response_data = response.json()
        access_token = response_data.get('access')
        
        if access_token:
            print(f"✅ Registration successful, got access token: {access_token[:20]}...")
            
            # Test authenticated endpoint
            print("\n2. Testing authenticated endpoint...")
            auth_headers = {
                'HTTP_AUTHORIZATION': f'Bearer {access_token}',
                'content_type': 'application/json'
            }
            
            user_response = client.get('/dj-rest-auth/user/', **auth_headers)
            print(f"User endpoint status: {user_response.status_code}")
            print(f"User endpoint response: {user_response.content.decode()[:200]}...")
            
            if user_response.status_code == 200:
                print("✅ Bearer token authentication working!")
            else:
                print("❌ Bearer token authentication failed!")
                
        else:
            print("❌ No access token in registration response")
    else:
        print(f"❌ Registration failed with status {response.status_code}")
        
    # Test login
    print("\n3. Testing login...")
    login_data = {
        'username': user_data['username'],
        'password': user_data['password1']
    }
    
    login_response = client.post(
        '/dj-rest-auth/login/',
        data=json.dumps(login_data),
        content_type='application/json'
    )
    
    print(f"Login status: {login_response.status_code}")
    print(f"Login response: {login_response.content.decode()[:500]}...")
    
    if login_response.status_code == 200:
        login_data = login_response.json()
        access_token = login_data.get('access')
        
        if access_token:
            print(f"✅ Login successful, got access token: {access_token[:20]}...")
        else:
            print("❌ No access token in login response")
    else:
        print(f"❌ Login failed with status {login_response.status_code}")

if __name__ == "__main__":
    print("🚀 Starting minimal authentication test...")
    test_authentication()
    print("\n✅ Test completed!") 