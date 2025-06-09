#!/usr/bin/env python
import sys
from pathlib import Path

# Add the utils directory to the path
sys.path.append(str(Path(__file__).parent / 'tests' / 'development' / 'utils'))

from run_dev_server import DevServerManager

def test_dev_server():
    """Simple test of the DevServerManager"""
    print("🔧 Testing DevServerManager...")
    
    try:
        server = DevServerManager(port=8002, timeout=30)
        print(f"Created DevServerManager for port {server.port}")
        
        if server.start_server():
            print("✅ Server started successfully!")
            
            # Test if it's accessible
            if server.is_running():
                print("✅ Server is running and accessible!")
            else:
                print("❌ Server started but not accessible")
                
            server.stop_server()
            print("✅ Server stopped")
        else:
            print("❌ Failed to start server")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_dev_server() 