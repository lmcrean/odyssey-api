"""
Main entry point for standalone Django development server management.
"""

from .server_manager import DevServerManager


def main():
    """Main function for running the server manager standalone."""
    with DevServerManager() as server:
        print(f"Server running at {server.base_url}")
        print("Press Enter to stop...")
        input()


if __name__ == "__main__":
    main() 