
## Problem Description

There is a discrepancy between branch and main deployment workflows in GitHub Actions. Branch deployments pass successfully, but main deployments fail when testing API endpoints.

## Error Details

**Location:** GitHub Actions workflow for main production deployment  
**Step:** Testing main production API endpoints  
**Specific Failure:** Pull requests endpoint returning 404

### Error Output

```
Run echo "🚀 Testing main production API endpoints..."
🚀 Testing main production API endpoints...
📄 Testing pull requests endpoint...
Pull requests test attempt 1/3...
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed

  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:-- 0
  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:-- 0
curl: (22) The requested URL returned error: 404
⏳ Waiting 10 seconds...
Pull requests test attempt 2/3...
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed

  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:-- 0
  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:-- 0
curl: (22) The requested URL returned error: 404
⏳ Waiting 10 seconds...
Pull requests test attempt 3/3...
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed

  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:-- 0
  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:-- 0
curl: (22) The requested URL returned error: 404
❌ Pull requests endpoint failed after 3 attempts
Error: Process completed with exit code 1.
```

## Current Status

- ✅ **Branch deployments**: Working correctly
- ❌ **Main deployments**: Failing on pull requests endpoint test
- ✅ **Health checks**: Now simplified (GitHub token validation removed)

## Analysis

The issue appears to be that the workflow is testing an endpoint `/api/github/pull-requests/test` that may not exist in the current API implementation. This suggests either:

1. The endpoint was removed or never implemented
2. There's a routing configuration difference between branch and main deployments
3. The test is expecting an endpoint that doesn't match the actual API structure

## Next Steps

1. Verify if `/api/github/pull-requests/test` endpoint exists in the current API
2. Check for differences in routing configuration between environments
3. Consider removing the failing endpoint test if the endpoint is not actually needed
4. Ensure consistency between branch and main deployment validation steps

## Context

> "I don't see why github token should be required for such a simple health check? would it not be easier to remove github tokens from the health check? open to rebuttal if intelligent"

This issue arose after simplifying health checks to remove unnecessary GitHub token validation. The core health check functionality is now working correctly, but there's an additional endpoint test that's failing.