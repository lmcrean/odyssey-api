#!/usr/bin/env python
import urllib.request
import json

# Test the API to see what error we get
API_BASE = "https://odyssey-fcmpfnvnx-lmcreans-projects.vercel.app/api"

def test_api_endpoints():
    """Test various API endpoints to see what works"""
    
    endpoints = [
        "/dj-rest-auth/user/",
        "/profiles/",
        "/posts/", 
        "/dj-rest-auth/registration/"
    ]
    
    print("🧪 Testing API endpoints...")
    print("=" * 50)
    
    for endpoint in endpoints:
        url = API_BASE + endpoint
        print(f"\n📡 Testing: {endpoint}")
        
        try:
            if endpoint == "/dj-rest-auth/registration/":
                # Try a POST request for registration
                data = json.dumps({
                    "username": "testuser123",
                    "email": "test@example.com", 
                    "password1": "testpass123",
                    "password2": "testpass123"
                }).encode('utf-8')
                
                req = urllib.request.Request(url, data=data)
                req.add_header('Content-Type', 'application/json')
                
                with urllib.request.urlopen(req) as response:
                    result = response.read().decode('utf-8')
                    print(f"  ✅ Status: {response.status}")
                    print(f"  📄 Response: {result[:200]}...")
            else:
                # GET request
                with urllib.request.urlopen(url) as response:
                    result = response.read().decode('utf-8')
                    print(f"  ✅ Status: {response.status}")
                    print(f"  📄 Response: {result[:200]}...")
                    
        except urllib.error.HTTPError as e:
            error_body = e.read().decode('utf-8')
            print(f"  ❌ HTTP {e.code}: {e.reason}")
            print(f"  📄 Error: {error_body[:300]}...")
            
            # Look for specific database errors
            if "relation" in error_body and "does not exist" in error_body:
                print(f"  🎯 DATABASE TABLE MISSING!")
        except Exception as e:
            print(f"  ❌ Error: {e}")

if __name__ == "__main__":
    test_api_endpoints() 