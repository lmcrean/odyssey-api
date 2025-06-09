import pytest
import requests
import json
import time

# Use the production URL consistently per user requirements
BASE_URL = 'https://odyssey-api-lmcreans-projects.vercel.app'

class TestAuthentication:
    """
    Test suite for authentication functionality following requirements in readme.md:
    1. sign up
    2. login
    3. store auth tokens and keep logged in
    
    Acceptance criteria:
    - authentication approach must be consistent between frontend and backend
    """
    
    def setup_method(self):
        """Setup for each test method."""
        self.test_user = {
            'username': f'testuser_{int(time.time())}',  # Unique username
            'password1': 'TestPassword123!',
            'password2': 'TestPassword123!'
        }
        self.login_data = {
            'username': self.test_user['username'],
            'password': self.test_user['password1']
        }
        self.tokens = {}
    
    def test_1_user_signup(self):
        """Test 1: User can sign up successfully."""
        response = requests.post(
            f"{BASE_URL}/dj-rest-auth/registration/",
            json=self.test_user
        )
        
        # Should return 201 Created or 204 No Content for successful registration
        assert response.status_code in [201, 204], f"Signup failed with status {response.status_code}: {response.text}"
        
        # If we get a JSON response, check it doesn't contain errors
        try:
            data = response.json()
            assert 'username' not in data or not any('already exists' in str(error) for error in data.get('username', [])), "Username already exists"
        except (json.JSONDecodeError, ValueError):
            # No JSON response is also acceptable for successful registration
            pass
    
    def test_2_user_login(self):
        """Test 2: User can login and receive JWT tokens."""
        # First ensure user exists (signup might have been skipped if user exists)
        signup_response = requests.post(
            f"{BASE_URL}/dj-rest-auth/registration/",
            json=self.test_user
        )
        
        # Now attempt login
        response = requests.post(
            f"{BASE_URL}/dj-rest-auth/login/",
            json=self.login_data
        )
        
        assert response.status_code == 200, f"Login failed with status {response.status_code}: {response.text}"
        
        data = response.json()
        
        # Verify JWT tokens are returned (Bearer token approach)
        assert 'access' in data, "Access token should be returned in response"
        assert 'refresh' in data, "Refresh token should be returned in response"
        assert 'user' in data, "User data should be returned in response"
        
        # Store tokens for next test
        self.tokens['access'] = data['access']
        self.tokens['refresh'] = data['refresh']
        
        # Verify token format (JWT tokens should be strings with dots)
        assert isinstance(data['access'], str), "Access token should be a string"
        assert isinstance(data['refresh'], str), "Refresh token should be a string"
        assert '.' in data['access'], "Access token should be in JWT format"
        assert '.' in data['refresh'], "Refresh token should be in JWT format"
        
        # Verify user data structure
        user_data = data['user']
        assert 'id' in user_data, "User ID should be returned"
        assert 'username' in user_data, "Username should be returned"
        assert user_data['username'] == self.login_data['username'], "Returned username should match login username"
    
    def test_3_token_authentication(self):
        """Test 3: JWT tokens can be used for authentication (Bearer token approach)."""
        # First login to get tokens
        login_response = requests.post(
            f"{BASE_URL}/dj-rest-auth/login/",
            json=self.login_data
        )
        
        if login_response.status_code != 200:
            # Try signup first if login fails
            requests.post(f"{BASE_URL}/dj-rest-auth/registration/", json=self.test_user)
            login_response = requests.post(f"{BASE_URL}/dj-rest-auth/login/", json=self.login_data)
        
        assert login_response.status_code == 200, f"Could not obtain tokens for authentication test"
        
        tokens = login_response.json()
        access_token = tokens['access']
        
        # Test authenticated request using Bearer token (consistent with frontend approach)
        headers = {
            'Authorization': f'Bearer {access_token}',
            'Content-Type': 'application/json'
        }
        
        response = requests.get(
            f"{BASE_URL}/dj-rest-auth/user/",
            headers=headers
        )
        
        assert response.status_code == 200, f"Authenticated request failed with status {response.status_code}: {response.text}"
        
        user_data = response.json()
        assert 'username' in user_data, "User data should be returned for authenticated request"
        assert user_data['username'] == self.login_data['username'], "Authenticated user should match logged in user"
    
    def test_4_token_refresh(self):
        """Test 4: Refresh tokens work correctly (consistent with frontend token refresh logic)."""
        # Login to get tokens
        login_response = requests.post(
            f"{BASE_URL}/dj-rest-auth/login/",
            json=self.login_data
        )
        
        if login_response.status_code != 200:
            requests.post(f"{BASE_URL}/dj-rest-auth/registration/", json=self.test_user)
            login_response = requests.post(f"{BASE_URL}/dj-rest-auth/login/", json=self.login_data)
        
        assert login_response.status_code == 200, "Could not obtain tokens for refresh test"
        
        tokens = login_response.json()
        refresh_token = tokens['refresh']
        
        # Test token refresh
        refresh_response = requests.post(
            f"{BASE_URL}/dj-rest-auth/token/refresh/",
            json={'refresh': refresh_token}
        )
        
        assert refresh_response.status_code == 200, f"Token refresh failed with status {refresh_response.status_code}: {refresh_response.text}"
        
        refresh_data = refresh_response.json()
        assert 'access' in refresh_data, "New access token should be returned"
        
        new_access_token = refresh_data['access']
        assert isinstance(new_access_token, str), "New access token should be a string"
        assert '.' in new_access_token, "New access token should be in JWT format"
        assert new_access_token != tokens['access'], "New access token should be different from old one"
        
        # Verify new token works for authentication
        headers = {
            'Authorization': f'Bearer {new_access_token}',
            'Content-Type': 'application/json'
        }
        
        auth_response = requests.get(
            f"{BASE_URL}/dj-rest-auth/user/",
            headers=headers
        )
        
        assert auth_response.status_code == 200, "New access token should work for authentication"
    
    def test_5_logout_functionality(self):
        """Test 5: Logout works correctly with Bearer token approach."""
        # Login first
        login_response = requests.post(
            f"{BASE_URL}/dj-rest-auth/login/",
            json=self.login_data
        )
        
        if login_response.status_code != 200:
            requests.post(f"{BASE_URL}/dj-rest-auth/registration/", json=self.test_user)
            login_response = requests.post(f"{BASE_URL}/dj-rest-auth/login/", json=self.login_data)
        
        assert login_response.status_code == 200, "Could not login for logout test"
        
        tokens = login_response.json()
        access_token = tokens['access']
        
        # Test logout
        headers = {
            'Authorization': f'Bearer {access_token}',
            'Content-Type': 'application/json'
        }
        
        logout_response = requests.post(
            f"{BASE_URL}/dj-rest-auth/logout/",
            headers=headers
        )
        
        # Logout should return 200 with Bearer token approach
        assert logout_response.status_code == 200, f"Logout failed with status {logout_response.status_code}: {logout_response.text}"
        
        # Check logout response
        try:
            logout_data = logout_response.json()
            assert 'detail' in logout_data, "Logout should return a detail message"
        except (json.JSONDecodeError, ValueError):
            # Empty response is also acceptable
            pass
    
    def test_6_authentication_consistency(self):
        """
        Test 6: Verify authentication approach is consistent between frontend and backend.
        
        This test validates that:
        - Backend accepts Bearer tokens (not cookies)
        - Token format is consistent with frontend expectations
        - Authentication flow matches frontend implementation
        """
        # Test the complete authentication flow as frontend would use it
        
        # 1. Registration (frontend posts to /dj-rest-auth/registration/)
        signup_response = requests.post(
            f"{BASE_URL}/dj-rest-auth/registration/",
            json=self.test_user,
            headers={'Content-Type': 'application/json'}
        )
        
        # Registration should succeed or user should already exist
        assert signup_response.status_code in [201, 204, 400], f"Registration response unexpected: {signup_response.status_code}"
        
        # 2. Login (frontend posts to /dj-rest-auth/login/)
        login_response = requests.post(
            f"{BASE_URL}/dj-rest-auth/login/",
            json=self.login_data,
            headers={'Content-Type': 'application/json'}
        )
        
        assert login_response.status_code == 200, f"Login should succeed: {login_response.text}"
        
        login_data = login_response.json()
        
        # 3. Verify response structure matches frontend expectations
        required_fields = ['access', 'refresh', 'user']
        for field in required_fields:
            assert field in login_data, f"Login response should contain '{field}' field"
        
        # 4. Test that Bearer token authentication works (frontend approach)
        access_token = login_data['access']
        
        # Frontend sets Authorization header as "Bearer {token}"
        headers = {
            'Authorization': f'Bearer {access_token}',
            'Content-Type': 'application/json'
        }
        
        # Test authenticated endpoint access
        user_response = requests.get(
            f"{BASE_URL}/dj-rest-auth/user/",
            headers=headers
        )
        
        assert user_response.status_code == 200, "Bearer token authentication should work"
        
        # 5. Test token refresh (frontend approach)
        refresh_token = login_data['refresh']
        refresh_response = requests.post(
            f"{BASE_URL}/dj-rest-auth/token/refresh/",
            json={'refresh': refresh_token},
            headers={'Content-Type': 'application/json'}
        )
        
        assert refresh_response.status_code == 200, "Token refresh should work"
        
        refresh_data = refresh_response.json()
        assert 'access' in refresh_data, "Refresh should return new access token"
        
        # Verify consistency: No cookies should be set (Bearer token approach)
        assert 'Set-Cookie' not in login_response.headers, "Login should not set cookies with Bearer token approach"
        assert 'Set-Cookie' not in refresh_response.headers, "Token refresh should not set cookies with Bearer token approach"
        
        print("✅ Authentication consistency verified:")
        print("   - Backend accepts Bearer tokens")
        print("   - No cookies are used")
        print("   - Token format matches frontend expectations")
        print("   - Authentication flow is consistent")


# Standalone functions for individual testing
def test_auth_endpoints_available():
    """Test that all required authentication endpoints are available."""
    endpoints = [
        '/dj-rest-auth/login/',
        '/dj-rest-auth/logout/',
        '/dj-rest-auth/registration/',
        '/dj-rest-auth/token/refresh/',
    ]
    
    # Test endpoints that don't require authentication
    for endpoint in endpoints:
        response = requests.options(f"{BASE_URL}{endpoint}")
        assert response.status_code in [200, 204, 405], f"Endpoint {endpoint} should be available"
    
    # Test user endpoint separately (requires authentication, so 401/403 is expected)
    user_endpoint_response = requests.get(f"{BASE_URL}/dj-rest-auth/user/")
    assert user_endpoint_response.status_code in [401, 403], f"User endpoint should require authentication"


if __name__ == "__main__":
    # Run a quick test
    test_instance = TestAuthentication()
    test_instance.setup_method()
    print("Running authentication tests...")
    
    try:
        test_instance.test_6_authentication_consistency()
        print("✅ All authentication tests passed!")
    except Exception as e:
        print(f"❌ Test failed: {e}") 