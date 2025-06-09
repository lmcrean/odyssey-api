import pytest
import requests
import time
import sys
from pathlib import Path

# Add the utils directory to the path
sys.path.append(str(Path(__file__).parent.parent / 'utils'))
from run_dev_server import DevServerManager


@pytest.fixture(scope="session")
def dev_server():
    """Fixture to manage Django development server for the test session"""
    with DevServerManager(port=8001, timeout=60) as server:  # Use port 8001 to avoid conflicts
        yield server


@pytest.fixture
def unique_user_data():
    """Fixture to generate unique user data for each test"""
    timestamp = str(int(time.time()))
    return {
        'username': f'e2euser_{timestamp}',
        'email': f'e2euser_{timestamp}@example.com',
        'password1': 'TestPassword123!',
        'password2': 'TestPassword123!'
    }


@pytest.fixture
def api_client(dev_server):
    """Fixture to provide API client with base URL"""
    class APITest:
        def __init__(self, base_url):
            self.base_url = base_url
            self.session = requests.Session()
            self.session.timeout = 10
            
        def post(self, endpoint, **kwargs):
            return self.session.post(f"{self.base_url}{endpoint}", **kwargs)
            
        def get(self, endpoint, **kwargs):
            return self.session.get(f"{self.base_url}{endpoint}", **kwargs)
            
        def put(self, endpoint, **kwargs):
            return self.session.put(f"{self.base_url}{endpoint}", **kwargs)
            
        def delete(self, endpoint, **kwargs):
            return self.session.delete(f"{self.base_url}{endpoint}", **kwargs)
    
    return APITest(dev_server.base_url)


class TestAuthenticationE2E:
    """End-to-end authentication tests using real HTTP requests"""
    
    def test_server_connectivity(self, api_client):
        """Test that the development server is running and accessible"""
        response = api_client.get('/')
        assert response.status_code in [200, 404], f"Server not accessible: {response.status_code}"
    
    def test_user_registration_e2e(self, api_client, unique_user_data):
        """Test complete user registration flow"""
        print(f"\n🔍 Testing registration for user: {unique_user_data['username']}")
        
        response = api_client.post(
            '/dj-rest-auth/registration/',
            json=unique_user_data
        )
        
        print(f"Registration response status: {response.status_code}")
        print(f"Registration response: {response.text[:300]}...")
        
        assert response.status_code == 201, f"Registration failed: {response.status_code} - {response.text}"
        
        data = response.json()
        assert 'access' in data, f"No access token in response: {data.keys()}"
        assert 'refresh' in data, f"No refresh token in response: {data.keys()}"
        assert 'user' in data, f"No user data in response: {data.keys()}"
        
        # Validate token structure
        access_token = data['access']
        refresh_token = data['refresh']
        assert len(access_token) > 50, "Access token seems too short"
        assert len(refresh_token) > 50, "Refresh token seems too short"
        assert access_token.count('.') == 2, "Access token doesn't have JWT structure"
        assert refresh_token.count('.') == 2, "Refresh token doesn't have JWT structure"
        
        print(f"✅ Registration successful - Access token: {access_token[:30]}...")
        return data

    def test_user_login_e2e(self, api_client, unique_user_data):
        """Test complete user login flow"""
        # First register the user
        reg_response = api_client.post('/dj-rest-auth/registration/', json=unique_user_data)
        assert reg_response.status_code == 201, "Failed to register user for login test"
        
        print(f"\n🔍 Testing login for user: {unique_user_data['username']}")
        
        login_data = {
            'username': unique_user_data['username'],
            'password': unique_user_data['password1']
        }
        
        response = api_client.post('/dj-rest-auth/login/', json=login_data)
        
        print(f"Login response status: {response.status_code}")
        print(f"Login response: {response.text[:300]}...")
        
        assert response.status_code == 200, f"Login failed: {response.status_code} - {response.text}"
        
        data = response.json()
        assert 'access' in data, f"No access token in login response: {data.keys()}"
        assert 'refresh' in data, f"No refresh token in login response: {data.keys()}"
        
        access_token = data['access']
        refresh_token = data['refresh']
        assert len(access_token) > 50, "Login access token seems too short"
        assert len(refresh_token) > 50, "Login refresh token seems too short"
        
        print(f"✅ Login successful - Access token: {access_token[:30]}...")
        return data

    def test_bearer_token_authentication_e2e(self, api_client, unique_user_data):
        """Test Bearer token authentication with protected endpoints"""
        # Register user and get tokens
        reg_data = self.test_user_registration_e2e(api_client, unique_user_data)
        access_token = reg_data['access']
        
        print(f"\n🔍 Testing Bearer token authentication")
        
        headers = {
            'Authorization': f'Bearer {access_token}',
            'Content-Type': 'application/json'
        }
        
        # Test dj-rest-auth user endpoint
        user_response = api_client.get('/dj-rest-auth/user/', headers=headers)
        
        print(f"User endpoint status: {user_response.status_code}")
        print(f"User endpoint response: {user_response.text[:200]}...")
        
        assert user_response.status_code == 200, f"User endpoint failed: {user_response.status_code} - {user_response.text}"
        
        user_data = user_response.json()
        assert 'username' in user_data, f"No username in user response: {user_data.keys()}"
        assert user_data['username'] == unique_user_data['username'], "Username mismatch in response"
        
        print(f"✅ Bearer authentication successful for user: {user_data['username']}")
        
        # Test custom endpoints
        endpoints_to_test = ['/posts/', '/profiles/']
        
        for endpoint in endpoints_to_test:
            print(f"\n🔍 Testing {endpoint} with Bearer token")
            response = api_client.get(endpoint, headers=headers)
            
            print(f"{endpoint} status: {response.status_code}")
            print(f"{endpoint} response length: {len(response.text)}")
            
            assert response.status_code == 200, f"{endpoint} failed: {response.status_code} - {response.text[:200]}"
            print(f"✅ {endpoint} authentication successful")

    def test_token_refresh_e2e(self, api_client, unique_user_data):
        """Test token refresh functionality"""
        # Register user and get tokens
        reg_data = self.test_user_registration_e2e(api_client, unique_user_data)
        refresh_token = reg_data['refresh']
        original_access = reg_data['access']
        
        print(f"\n🔍 Testing token refresh")
        
        refresh_data = {'refresh': refresh_token}
        response = api_client.post('/dj-rest-auth/token/refresh/', json=refresh_data)
        
        print(f"Refresh response status: {response.status_code}")
        print(f"Refresh response: {response.text[:300]}...")
        
        assert response.status_code == 200, f"Token refresh failed: {response.status_code} - {response.text}"
        
        data = response.json()
        assert 'access' in data, f"No access token in refresh response: {data.keys()}"
        
        new_access_token = data['access']
        assert new_access_token != original_access, "New access token is the same as original"
        assert len(new_access_token) > 50, "New access token seems too short"
        
        print(f"✅ Token refresh successful")
        
        # Test that new token works
        headers = {
            'Authorization': f'Bearer {new_access_token}',
            'Content-Type': 'application/json'
        }
        
        user_response = api_client.get('/dj-rest-auth/user/', headers=headers)
        assert user_response.status_code == 200, "New access token doesn't work"
        
        print(f"✅ New access token works correctly")

    def test_logout_e2e(self, api_client, unique_user_data):
        """Test user logout functionality"""
        # Register user and get tokens
        reg_data = self.test_user_registration_e2e(api_client, unique_user_data)
        access_token = reg_data['access']
        
        print(f"\n🔍 Testing logout")
        
        headers = {
            'Authorization': f'Bearer {access_token}',
            'Content-Type': 'application/json'
        }
        
        response = api_client.post('/dj-rest-auth/logout/', headers=headers)
        
        print(f"Logout response status: {response.status_code}")
        print(f"Logout response: {response.text}")
        
        # Logout should succeed with 200 or 204
        assert response.status_code in [200, 204], f"Logout failed: {response.status_code} - {response.text}"
        
        print(f"✅ Logout successful")

    def test_authentication_consistency_e2e(self, api_client, unique_user_data):
        """Test complete authentication flow consistency"""
        print(f"\n🔍 Testing complete authentication flow consistency")
        
        # Full flow test
        reg_data = self.test_user_registration_e2e(api_client, unique_user_data)
        login_data = self.test_user_login_e2e(api_client, unique_user_data)
        
        # Compare tokens - they should be different but valid
        reg_access = reg_data['access']
        login_access = login_data['access']
        
        assert reg_access != login_access, "Registration and login tokens should be different"
        
        # Test both tokens work
        for token_name, token in [("registration", reg_access), ("login", login_access)]:
            headers = {'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'}
            response = api_client.get('/dj-rest-auth/user/', headers=headers)
            assert response.status_code == 200, f"{token_name} token doesn't work"
            print(f"✅ {token_name} token works correctly")
        
        print(f"✅ Authentication flow is fully consistent!")

    def test_invalid_token_handling_e2e(self, api_client):
        """Test how the API handles invalid tokens"""
        print(f"\n🔍 Testing invalid token handling")
        
        invalid_tokens = [
            "invalid-token",
            "Bearer invalid-token", 
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid.signature",
            ""
        ]
        
        for invalid_token in invalid_tokens:
            headers = {
                'Authorization': f'Bearer {invalid_token}',
                'Content-Type': 'application/json'
            }
            
            response = api_client.get('/dj-rest-auth/user/', headers=headers)
            print(f"Invalid token '{invalid_token[:20]}...' status: {response.status_code}")
            
            # Should return 401 Unauthorized for invalid tokens
            assert response.status_code == 401, f"Expected 401 for invalid token, got {response.status_code}"
        
        print(f"✅ Invalid token handling works correctly")


if __name__ == "__main__":
    # Run tests with pytest
    pytest.main([__file__, "-v", "-s"]) 