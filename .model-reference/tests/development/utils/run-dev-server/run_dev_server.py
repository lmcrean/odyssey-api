"""
Django development server management for testing.

This module provides a simplified interface to the refactored server management
utilities. The actual implementation has been moved to the runners package
for better organization and maintainability.
"""

try:
    # Try relative import first (when used as a module)
    from .runners import DevServerManager, run_with_dev_server
except ImportError:
    # If relative import fails, try absolute import (when run directly)
    import sys
    from pathlib import Path
    
    # Add the current directory to Python path
    current_dir = Path(__file__).parent
    sys.path.insert(0, str(current_dir))
    
    from runners import DevServerManager, run_with_dev_server

# Export the main classes for backward compatibility
__all__ = ['DevServerManager', 'run_with_dev_server']

if __name__ == "__main__":
    # Test the server manager
    with DevServerManager() as server:
        print(f"Server running at {server.base_url}")
        print("Press Enter to stop...")
        input()
