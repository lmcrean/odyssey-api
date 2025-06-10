"""
Server configuration utilities for Django development server management.
"""

import os
import sys
from pathlib import Path


class ServerConfig:
    """Handles configuration for the Django development server."""
    
    def __init__(self, port=8000, timeout=30):
        self.port = port
        self.timeout = timeout
        self.base_url = f"http://127.0.0.1:{port}"
        
    def get_environment(self):
        """Get environment variables for test server."""
        env = os.environ.copy()
        env['DEV'] = '1'  # Use SQLite for local testing
        env['DJANGO_SETTINGS_MODULE'] = 'tests.development.utils.test_settings'  # Use test settings
        return env
        
    def get_backend_directory(self):
        """Get the backend directory path where manage.py is located."""
        # Go up from tests/development/utils/run-dev-server/runners to backend
        backend_dir = Path(__file__).parent.parent.parent.parent.parent.parent
        return backend_dir
        
    def validate_setup(self):
        """Validate that the Django setup is correct."""
        backend_dir = self.get_backend_directory()
        manage_py_path = backend_dir / 'manage.py'
        
        if not manage_py_path.exists():
            print(f"❌ manage.py not found at {manage_py_path}")
            return False, backend_dir
            
        return True, backend_dir
        
    def get_server_command(self):
        """Get the command to start the Django server."""
        return [
            sys.executable, 
            'manage.py', 
            'runserver', 
            f'127.0.0.1:{self.port}', 
            '--noreload'
        ] 