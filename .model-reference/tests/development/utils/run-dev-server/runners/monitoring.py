"""
Server monitoring utilities for Django development server management.
"""

import time
import requests


class ServerMonitor:
    """Handles monitoring and status checking of the Django development server."""
    
    def __init__(self, config, lifecycle):
        self.config = config
        self.lifecycle = lifecycle
        
    def is_server_responding(self):
        """Check if the server is responding to HTTP requests."""
        try:
            response = requests.get(f"{self.config.base_url}/", timeout=2)
            return response.status_code in [200, 404]
        except requests.exceptions.RequestException:
            return False
    
    def wait_for_server_ready(self):
        """Wait for the server to be ready to accept connections."""
        start_time = time.time()
        server_started_msg_seen = False
        
        while time.time() - start_time < self.config.timeout:
            # Check if process is still running
            if not self.lifecycle.is_process_running():
                print("❌ Server process has terminated unexpectedly")
                self.lifecycle.get_process_output()
                return False
            
            # Read server output
            if self.lifecycle.process and self.lifecycle.process.stdout:
                try:
                    line = self.lifecycle.process.stdout.readline()
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
            if self.is_server_responding():
                print(f"✅ Server is responding")
                return True
            
            # Adjust sleep based on whether we've seen startup message
            if not server_started_msg_seen:
                time.sleep(0.5)
                print("⏳ Waiting for server to start...")
            else:
                time.sleep(0.1)  # Check more frequently once we see startup message
        
        return False 