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
        # Go up from tests/development/utils to backend
        backend_dir = Path(__file__).parent.parent.parent.parent
        print(f"📁 Backend directory: {backend_dir}")
        
        # Check if manage.py exists
        manage_py_path = backend_dir / 'manage.py'
        if not manage_py_path.exists():
            print(f"❌ manage.py not found at {manage_py_path}")
            return False
        
        try:
            # Start the server process (simplified approach based on working example)
            cmd = [sys.executable, 'manage.py', 'runserver', f'127.0.0.1:{self.port}', '--noreload']
            print(f"🔧 Running command: {' '.join(cmd)}")
            print(f"📁 Working directory: {backend_dir}")
            
            self.process = subprocess.Popen(
                cmd,
                cwd=backend_dir,
                env=env,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True
            )
            
            # Wait for server to start (simple approach)
            print("⏳ Waiting for server to start...")
            time.sleep(3)  # Give server time to start
            
            # Check if server is responding
            if self.is_running():
                print(f"✅ Server started successfully at {self.base_url}")
                return True
            else:
                print("❌ Server failed to start")
                self._print_server_output()
                self.stop_server()
                return False
                
        except Exception as e:
            print(f"❌ Failed to start server: {e}")
            return False
    
    def _wait_for_server(self):
        """Wait for the server to be ready to accept connections"""
        start_time = time.time()
        server_started_msg_seen = False
        
        while time.time() - start_time < self.timeout:
            # Check if process is still running
            if self.process.poll() is not None:
                print("❌ Server process has terminated unexpectedly")
                self._print_server_output()
                return False
            
            # Read any output from the server
            if self.process.stdout:
                try:
                    line = self.process.stdout.readline()
                    if line:
                        line = line.strip()
                        print(f"📟 Server: {line}")
                        # Look for Django's startup message
                        if "Starting development server at" in line:
                            server_started_msg_seen = True
                        if "Quit the server with" in line:
                            # Server is fully started
                            time.sleep(1)  # Give it a moment
                            return True
                except:
                    pass
            
            # Try to connect to the server
            try:
                response = requests.get(f"{self.base_url}/", timeout=1)
                if response.status_code in [200, 404]:  # Server is responding
                    print(f"✅ Server is responding with status {response.status_code}")
                    return True
            except requests.exceptions.RequestException:
                pass  # Server not ready yet
            
            if not server_started_msg_seen:
                time.sleep(0.5)
                print("⏳ Waiting for server to start...")
            else:
                time.sleep(0.1)  # Check more frequently once we see startup message
        
        return False
    
    def _print_server_output(self):
        """Print any remaining server output for debugging"""
        if self.process and self.process.stdout:
            try:
                remaining_output = self.process.stdout.read()
                if remaining_output:
                    print("📟 Remaining server output:")
                    print(remaining_output)
            except:
                pass
    
    def stop_server(self):
        """Stop the Django development server"""
        if self.process:
            print("🛑 Stopping Django development server...")
            self.process.terminate()
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
