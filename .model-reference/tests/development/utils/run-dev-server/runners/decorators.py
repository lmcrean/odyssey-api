"""
Decorator utilities for Django development server management.
"""

from .server_manager import DevServerManager


def run_with_dev_server(test_function, port=8000):
    """Decorator/function to run a test with a managed dev server."""
    def wrapper(*args, **kwargs):
        with DevServerManager(port=port) as server:
            return test_function(server.base_url, *args, **kwargs)
    return wrapper 