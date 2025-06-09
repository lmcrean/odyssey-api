#!/usr/bin/env python
import sys
from pathlib import Path
import requests

# Add the utils directory to the path
sys.path.append(str(Path(__file__).parent / 'tests' / 'development' / 'utils'))

from run_dev_server import DevServerManager

def test_fixed_dev_server():
    """Test the fixed DevServerManager with test settings"""
    print("🔧 Testing Fixed DevServerManager with test settings...")
    
    try:
        with DevServerManager(port=8003, timeout=30) as server:
            print(f"✅ Server context manager worked!")
            print(f"Server URL: {server.base_url}")
            
            # Test basic connectivity
            response = requests.get(f"{server.base_url}/")
            print(f"Root endpoint status: {response.status_code}")
            
            # Test dj-rest-auth endpoints are available
            try:
                auth_response = requests.get(f"{server.base_url}/dj-rest-auth/user/")
                print(f"Auth endpoint status: {auth_response.status_code} (401 expected for unauthenticated)")
            except Exception as e:
                print(f"Auth endpoint test failed: {e}")
            
            print("✅ DevServerManager test completed successfully!")
            
    except Exception as e:
        print(f"❌ DevServerManager test failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_fixed_dev_server() 