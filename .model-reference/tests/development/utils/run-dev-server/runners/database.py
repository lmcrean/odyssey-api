"""
Database operations for Django development server management.
"""

import subprocess
import sys


class DatabaseManager:
    """Handles database operations for the test server."""
    
    def __init__(self, config):
        self.config = config
        
    def setup_database(self):
        """Setup the test database with migrations."""
        print("🔧 Setting up test database...")
        
        is_valid, backend_dir = self.config.validate_setup()
        if not is_valid:
            return False
            
        env = self.config.get_environment()
        
        try:
            migrate_cmd = [sys.executable, 'manage.py', 'migrate', '--run-syncdb']
            migrate_process = subprocess.run(
                migrate_cmd,
                cwd=backend_dir,
                env=env,
                capture_output=True,
                text=True
            )
            
            if migrate_process.returncode != 0:
                print(f"❌ Database setup failed: {migrate_process.stderr}")
                return False
            
            print("✅ Test database setup complete")
            return True
            
        except Exception as e:
            print(f"❌ Database setup error: {e}")
            return False 