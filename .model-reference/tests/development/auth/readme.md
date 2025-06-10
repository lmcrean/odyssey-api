test with pytest

1. sign up 
2. login
3. store auth tokens and keep logged in

acceptance criteria:

- [x] authentication approach must be consistent between the frontend and backend

## Authentication Consistency Implemented:

✅ **Backend Changes:**
- Removed JWT cookie authentication, using only Bearer tokens
- Updated REST_AUTH configuration to disable cookies
- Simplified logout route for Bearer token approach
- Ensured SIMPLE_JWT settings are consistent

✅ **Frontend Compatibility:**
- Backend now accepts Bearer tokens in Authorization header
- Token response format matches frontend expectations (access, refresh, user)
- No cookies are set, tokens stored in localStorage as expected
- Token refresh endpoint works with frontend approach

✅ **Test Coverage:**
- Comprehensive authentication test suite created
- Tests signup, login, token authentication, token refresh, and logout
- Validates consistency between frontend and backend approaches
- Uses production URL format as per user requirements