import pytest

class TestAuthE2E:
    """Simplified E2E authentication tests"""
    
    def test_server_works(self, api_client):
        """Test that server is accessible"""
        response = api_client.get('/')
        assert response.status_code in [200, 404]
        print("✅ Server is accessible")
    
    def test_registration(self, api_client, unique_user):
        """Test user registration"""
        print(f"🔍 Testing registration for: {unique_user['username']}")
        
        response = api_client.post('/dj-rest-auth/registration/', json=unique_user)
        
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text[:200]}...")
        
        assert response.status_code == 201
        data = response.json()
        assert 'access' in data
        assert 'refresh' in data
        
        print("✅ Registration successful")
        return data
    
    def test_login(self, api_client, unique_user):
        """Test user login after registration"""
        # First register
        reg_response = api_client.post('/dj-rest-auth/registration/', json=unique_user)
        assert reg_response.status_code == 201
        
        # Then login
        login_data = {
            'username': unique_user['username'],
            'password': unique_user['password1']
        }
        
        print(f"🔍 Testing login for: {unique_user['username']}")
        response = api_client.post('/dj-rest-auth/login/', json=login_data)
        
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text[:200]}...")
        
        assert response.status_code == 200
        data = response.json()
        assert 'access' in data
        assert 'refresh' in data
        
        print("✅ Login successful")
        return data
    
    def test_bearer_auth(self, api_client, unique_user):
        """Test Bearer token authentication"""
        # Register and get token
        reg_data = self.test_registration(api_client, unique_user)
        access_token = reg_data['access']
        
        print("🔍 Testing Bearer token authentication")
        
        headers = {
            'Authorization': f'Bearer {access_token}',
            'Content-Type': 'application/json'
        }
        
        response = api_client.get('/dj-rest-auth/user/', headers=headers)
        
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text[:200]}...")
        
        assert response.status_code == 200
        user_data = response.json()
        assert user_data['username'] == unique_user['username']
        
        print("✅ Bearer authentication successful")
    
    def test_full_auth_flow(self, api_client, unique_user):
        """Test complete authentication flow"""
        print("🔍 Testing complete authentication flow")
        
        # 1. Register
        reg_data = self.test_registration(api_client, unique_user)
        
        # 2. Login 
        login_data = self.test_login(api_client, unique_user)
        
        # 3. Test both tokens work
        for token_name, token in [("registration", reg_data['access']), ("login", login_data['access'])]:
            headers = {'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'}
            response = api_client.get('/dj-rest-auth/user/', headers=headers)
            assert response.status_code == 200
            print(f"✅ {token_name} token works")
        
        print("✅ Complete authentication flow successful") 