"""
Server lifecycle management for Django development server.
"""

import subprocess
import time


class ServerLifecycle:
    """Handles starting and stopping the Django development server."""
    
    def __init__(self, config):
        self.config = config
        self.process = None
        
    def start_process(self):
        """Start the Django server process."""
        is_valid, backend_dir = self.config.validate_setup()
        if not is_valid:
            return False
            
        env = self.config.get_environment()
        cmd = self.config.get_server_command()
        
        print(f"🔧 Running command: {' '.join(cmd)}")
        print(f"📁 Working directory: {backend_dir}")
        
        try:
            self.process = subprocess.Popen(
                cmd,
                cwd=backend_dir,
                env=env,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True
            )
            
            # Give server time to start
            print("⏳ Waiting for server to start...")
            time.sleep(4)
            
            return True
            
        except Exception as e:
            print(f"❌ Failed to start server process: {e}")
            return False
    
    def stop_process(self):
        """Stop the Django server process."""
        if self.process:
            print("🛑 Stopping Django development server...")
            self.process.terminate()
            self.process.wait()
            self.process = None
            print("✅ Server stopped")
    
    def is_process_running(self):
        """Check if the server process is still running."""
        return self.process and self.process.poll() is None
    
    def get_process_output(self):
        """Get any remaining output from the server process."""
        if self.process and self.process.stdout:
            try:
                remaining_output = self.process.stdout.read()
                if remaining_output:
                    print("📟 Remaining server output:")
                    print(remaining_output)
            except:
                pass 