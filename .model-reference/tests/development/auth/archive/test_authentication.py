import requests
import json
import pytest
import time
import sys
from pathlib import Path

# Add the utils directory to the path
sys.path.append(str(Path(__file__).parent.parent / 'utils'))
from run_dev_server import DevServerManager

class TestAuthentication:
    def setup_method(self):
        """Setup for each test method"""
        # Use timestamp to ensure unique usernames
        timestamp = str(int(time.time()))
        self.test_user_data = {
            "username": f"testuser{timestamp}",
            "email": f"testuser{timestamp}@example.com", 
            "password1": "testpassword123",
            "password2": "testpassword123"
        }
        self.access_token = None
        self.refresh_token = None

    def test_01_signup(self, base_url):
        """Test user registration"""
        print("\n=== Testing Signup ===")
        
        url = f"{base_url}/dj-rest-auth/registration/"
        response = requests.post(url, json=self.test_user_data)
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        assert response.status_code == 201, f"Expected 201, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert "access" in data, f"No access token in response: {data}"
        assert "refresh" in data, f"No refresh token in response: {data}"
        assert "user" in data, f"No user data in response: {data}"
        
        # Store tokens for subsequent tests
        self.access_token = data["access"]
        self.refresh_token = data["refresh"]
        
        print(f"✅ Signup successful - Access token: {self.access_token[:20]}...")
        print(f"✅ Refresh token: {self.refresh_token[:20]}...")

    def test_02_login(self, base_url):
        """Test user login"""
        print("\n=== Testing Login ===")
        
        url = f"{base_url}/dj-rest-auth/login/"
        login_data = {
            "username": self.test_user_data["username"],
            "password": self.test_user_data["password1"]
        }
        response = requests.post(url, json=login_data)
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert "access" in data, f"No access token in response: {data}"
        assert "refresh" in data, f"No refresh token in response: {data}"
        
        # Update tokens
        self.access_token = data["access"]
        self.refresh_token = data["refresh"]
        
        print(f"✅ Login successful - Access token: {self.access_token[:20]}...")
        print(f"✅ Refresh token: {self.refresh_token[:20]}...")

    def test_03_token_authentication(self, base_url):
        """Test Bearer token authentication with dj-rest-auth user endpoint"""
        print("\n=== Testing Token Authentication ===")
        
        if not self.access_token:
            self.test_02_login(base_url)
        
        url = f"{base_url}/dj-rest-auth/user/"
        headers = {
            "Authorization": f"Bearer {self.access_token}",
            "Content-Type": "application/json"
        }
        
        response = requests.get(url, headers=headers)
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        print(f"Headers sent: {headers}")
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert "username" in data, f"No username in response: {data}"
        assert data["username"] == self.test_user_data["username"]
        
        print(f"✅ Token authentication successful for user: {data['username']}")

    def test_04_custom_endpoint_authentication(self, base_url):
        """Test Bearer token authentication with custom endpoints"""
        print("\n=== Testing Custom Endpoint Authentication ===")
        
        if not self.access_token:
            self.test_02_login(base_url)
        
        # Test posts endpoint
        url = f"{base_url}/posts/"
        headers = {
            "Authorization": f"Bearer {self.access_token}",
            "Content-Type": "application/json"
        }
        
        response = requests.get(url, headers=headers)
        
        print(f"Posts endpoint - Status Code: {response.status_code}")
        print(f"Posts endpoint - Response: {response.text[:200]}...")
        
        assert response.status_code == 200, f"Posts endpoint failed: {response.status_code}: {response.text}"
        
        # Test profiles endpoint
        url = f"{base_url}/profiles/"
        response = requests.get(url, headers=headers)
        
        print(f"Profiles endpoint - Status Code: {response.status_code}")
        print(f"Profiles endpoint - Response: {response.text[:200]}...")
        
        assert response.status_code == 200, f"Profiles endpoint failed: {response.status_code}: {response.text}"
        
        print("✅ Custom endpoints authentication successful")

    def test_05_token_refresh(self, base_url):
        """Test token refresh"""
        print("\n=== Testing Token Refresh ===")
        
        if not self.refresh_token:
            self.test_02_login(base_url)
        
        url = f"{base_url}/dj-rest-auth/token/refresh/"
        refresh_data = {"refresh": self.refresh_token}
        
        response = requests.post(url, json=refresh_data)
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert "access" in data, f"No access token in refresh response: {data}"
        
        # Update access token
        old_token = self.access_token
        self.access_token = data["access"]
        
        print(f"✅ Token refresh successful")
        print(f"Old token: {old_token[:20]}...")
        print(f"New token: {self.access_token[:20]}...")

    def test_06_logout(self, base_url):
        """Test logout"""
        print("\n=== Testing Logout ===")
        
        if not self.access_token:
            self.test_02_login(base_url)
        
        url = f"{base_url}/dj-rest-auth/logout/"
        headers = {
            "Authorization": f"Bearer {self.access_token}",
            "Content-Type": "application/json"
        }
        
        response = requests.post(url, headers=headers)
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        # Logout should succeed (200) or handle gracefully
        assert response.status_code in [200, 204], f"Logout failed: {response.status_code}: {response.text}"
        
        print("✅ Logout successful")

    def test_07_authentication_consistency(self, base_url):
        """Test overall authentication consistency"""
        print("\n=== Testing Authentication Consistency ===")
        
        # Full flow test
        self.test_01_signup(base_url)
        self.test_02_login(base_url) 
        self.test_03_token_authentication(base_url)
        self.test_04_custom_endpoint_authentication(base_url)
        self.test_05_token_refresh(base_url)
        
        print("✅ Authentication flow is consistent!")

def run_authentication_tests():
    """Run all authentication tests with managed dev server"""
    print("🚀 Starting Authentication Tests with Managed Dev Server")
    
    with DevServerManager() as server:
        test = TestAuthentication()
        base_url = server.base_url
        
        try:
            print(f"Testing against: {base_url}")
            
            test.setup_method()
            test.test_01_signup(base_url)
            test.test_02_login(base_url)
            test.test_03_token_authentication(base_url)
            test.test_04_custom_endpoint_authentication(base_url)
            test.test_05_token_refresh(base_url)
            test.test_06_logout(base_url)
            
            print("\n🎉 All authentication tests passed!")
            return True
            
        except Exception as e:
            print(f"\n❌ Test failed: {str(e)}")
            import traceback
            traceback.print_exc()
            return False

if __name__ == "__main__":
    # Run tests with managed server
    success = run_authentication_tests()
    sys.exit(0 if success else 1) 