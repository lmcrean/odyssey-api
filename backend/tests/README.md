# Production URL Tests

This directory contains tests that validate the production URLs of the application.

## Setup

Install the required dependencies:

```bash
pip install -r requirements-test.txt
```

## Running the Tests

Run all tests:

```bash
pytest
```

Run tests for a specific URL:

```bash
pytest tests/test_production_urls.py::test_api_root_endpoint -v
```

Run a specific test function:

```bash
pytest tests/test_production_urls.py::test_posts_endpoint -v
```

## Test Coverage

These tests validate:

1. API root endpoint (/api/)
2. Posts endpoint (/api/posts/)
3. Profiles endpoint (/api/profiles/)
4. Comments endpoint (/api/comments/)
5. Messaging endpoint (/api/messages/)
6. Authentication endpoints
7. Basic rate limiting

## Notes

- These tests only validate that the endpoints return expected responses, not the full functionality.
- The tests assume that the production URLs are accessible from your network.
- Authentication tests only check that the endpoints are available, not that authentication works correctly. 