"""
Main Django development server manager.
"""

from .config import ServerConfig
from .database import DatabaseManager
from .lifecycle import ServerLifecycle
from .monitoring import ServerMonitor


class DevServerManager:
    """Main manager for Django development server during testing."""
    
    def __init__(self, port=8000, timeout=30):
        self.config = ServerConfig(port, timeout)
        self.database = DatabaseManager(self.config)
        self.lifecycle = ServerLifecycle(self.config)
        self.monitor = ServerMonitor(self.config, self.lifecycle)
        
    @property
    def base_url(self):
        """Get the base URL of the server."""
        return self.config.base_url
        
    def start_server(self):
        """Start the Django development server with full setup."""
        print(f"🚀 Starting Django development server on port {self.config.port}...")
        
        # Setup database
        if not self.database.setup_database():
            return False
        
        # Start server process
        if not self.lifecycle.start_process():
            return False
        
        # Wait for server to be ready (simplified approach)
        if self.monitor.is_server_responding():
            print(f"✅ Server started successfully at {self.base_url}")
            return True
        else:
            print("❌ Server failed to start")
            self.lifecycle.get_process_output()
            self.stop_server()
            return False
    
    def stop_server(self):
        """Stop the Django development server."""
        self.lifecycle.stop_process()
    
    def is_running(self):
        """Check if the server is running and responding."""
        return self.monitor.is_server_responding()
    
    def __enter__(self):
        """Context manager entry."""
        if self.start_server():
            return self
        else:
            raise RuntimeError("Failed to start development server")
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        """Context manager exit."""
        self.stop_server() 