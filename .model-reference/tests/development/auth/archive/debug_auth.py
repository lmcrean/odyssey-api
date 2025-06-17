import requests
import json
import time

BASE_URL = 'http://127.0.0.1:8000'

# Create a test user
test_user = {
    'username': f'debuguser_{int(time.time())}',
    'password1': 'TestPassword123!',
    'password2': 'TestPassword123!'
}

login_data = {
    'username': test_user['username'],
    'password': test_user['password1']
}

print("1. Testing registration...")
signup_response = requests.post(
    f"{BASE_URL}/dj-rest-auth/registration/",
    json=test_user
)
print(f"Registration status: {signup_response.status_code}")

if signup_response.status_code == 201:
    try:
        reg_data = signup_response.json()
        print(f"Registration returned access token: {bool(reg_data.get('access'))}")
        print(f"Registration returned refresh token: {bool(reg_data.get('refresh'))}")
        
        if reg_data.get('access'):
            print("\n2. Testing user endpoint with registration token...")
            headers = {
                'Authorization': f'Bearer {reg_data["access"]}',
                'Content-Type': 'application/json'
            }
            auth_user_response = requests.get(f"{BASE_URL}/dj-rest-auth/user/", headers=headers)
            print(f"User endpoint (with reg token) status: {auth_user_response.status_code}")
            print(f"User endpoint (with reg token) response: {auth_user_response.text[:200]}...")
            
            # Test other endpoints
            print("\n3. Testing posts endpoint with Bearer token...")
            posts_response = requests.get(f"{BASE_URL}/posts/", headers=headers)
            print(f"Posts endpoint status: {posts_response.status_code}")
            
            print("\n4. Testing profiles endpoint with Bearer token...")
            profiles_response = requests.get(f"{BASE_URL}/profiles/", headers=headers)
            print(f"Profiles endpoint status: {profiles_response.status_code}")
            
    except Exception as e:
        print(f"Error parsing registration JSON: {e}")

print("\n5. Testing login...")
login_response = requests.post(
    f"{BASE_URL}/dj-rest-auth/login/",
    json=login_data
)
print(f"Login status: {login_response.status_code}")

if login_response.status_code == 200:
    try:
        data = login_response.json()
        print(f"Login returned access token: {bool(data.get('access'))}")
        print(f"Login returned refresh token: {bool(data.get('refresh'))}")
        print(f"Refresh token value: '{data.get('refresh')}'")
        
        if data.get('access'):
            print("\n6. Testing user endpoint with login token...")
            headers = {
                'Authorization': f'Bearer {data["access"]}',
                'Content-Type': 'application/json'
            }
            auth_user_response = requests.get(f"{BASE_URL}/dj-rest-auth/user/", headers=headers)
            print(f"User endpoint (with login token) status: {auth_user_response.status_code}")
            print(f"User endpoint (with login token) response: {auth_user_response.text[:200]}...")
            
    except Exception as e:
        print(f"Error parsing login JSON: {e}")

# Test if the issue is specific to dj-rest-auth endpoints
print("\n7. Testing root endpoint...")
root_response = requests.get(f"{BASE_URL}/")
print(f"Root endpoint status: {root_response.status_code}")
print(f"Root endpoint response: {root_response.text[:100]}...") 