import pytest
import sys
from pathlib import Path
import os
import subprocess
import time
import requests

# Add the utils directory to the path
sys.path.append(str(Path(__file__).parent.parent / 'utils'))
from run_dev_server import DevServerManager


@pytest.fixture(scope="session")
def dev_server():
    """Session-scoped fixture to manage Django development server"""
    with DevServerManager(port=8001, timeout=30) as server:
        yield server


@pytest.fixture
def api_client(dev_server):
    """Fixture to provide API client with base URL"""
    class APIClient:
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
    
    return APIClient(dev_server.base_url)


@pytest.fixture
def unique_user():
    """Fixture to generate unique user data for each test"""
    import time
    timestamp = str(int(time.time()))
    return {
        'username': f'e2euser_{timestamp}',
        'email': f'e2euser_{timestamp}@example.com', 
        'password1': 'TestPassword123!',
        'password2': 'TestPassword123!'
    } 