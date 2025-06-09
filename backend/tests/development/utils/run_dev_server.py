import os
import subprocess
import time
import requests
import sys
from pathlib import Path

class DevServerManager:
    def __init__(self, port=8000, timeout=30):
        self.port = port
        self.timeout = timeout
        self.process = None
        self.base_url = f"http://127.0.0.1:{port}"
        
    def start_server(self):
        """Start the Django development server"""
        print(f"🚀 Starting Django development server on port {self.port}...")
        
        # Set up environment
        env = os.environ.copy()
        env['DEV'] = '1'  # Use SQLite for local testing
        
        # Get the backend directory (where manage.py is located)
        backend_dir = Path(__file__).parent.parent.parent
        
        try:
            # Start the server process
            self.process = subprocess.Popen(
                [sys.executable, 'manage.py', 'runserver', f'127.0.0.1:{self.port}'],
                cwd=backend_dir,
                env=env,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True
            )
            
            # Wait for server to be ready
            if self._wait_for_server():
                print(f"✅ Server started successfully at {self.base_url}")
                return True
            else:
                print("❌ Server failed to start within timeout period")
                self.stop_server()
                return False
                
        except Exception as e:
            print(f"❌ Failed to start server: {e}")
            return False
    
    def _wait_for_server(self):
        """Wait for the server to be ready to accept connections"""
        start_time = time.time()
        
        while time.time() - start_time < self.timeout:
            try:
                response = requests.get(f"{self.base_url}/", timeout=1)
                if response.status_code in [200, 404]:  # Server is responding
                    time.sleep(2)  # Give it a moment to fully initialize
                    return True
            except requests.exceptions.RequestException:
                pass  # Server not ready yet
            
            time.sleep(1)
            print("⏳ Waiting for server to start...")
        
        return False
    
    def stop_server(self):
        """Stop the Django development server"""
        if self.process:
            print("🛑 Stopping Django development server...")
            self.process.terminate()
            try:
                self.process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                self.process.kill()
                self.process.wait()
            self.process = None
            print("✅ Server stopped")
    
    def is_running(self):
        """Check if the server is running"""
        try:
            response = requests.get(f"{self.base_url}/", timeout=2)
            return response.status_code in [200, 404]
        except requests.exceptions.RequestException:
            return False
    
    def __enter__(self):
        """Context manager entry"""
        if self.start_server():
            return self
        else:
            raise RuntimeError("Failed to start development server")
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        """Context manager exit"""
        self.stop_server()

def run_with_dev_server(test_function, port=8000):
    """Decorator/function to run a test with a managed dev server"""
    def wrapper(*args, **kwargs):
        with DevServerManager(port=port) as server:
            return test_function(server.base_url, *args, **kwargs)
    return wrapper

if __name__ == "__main__":
    # Test the server manager
    with DevServerManager() as server:
        print(f"Server running at {server.base_url}")
        print("Press Enter to stop...")
        input()
