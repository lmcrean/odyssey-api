# PowerShell script to run production URL tests

Write-Host "Installing test dependencies..."
pip install -r requirements-test.txt

Write-Host "`nRunning production URL tests..."
pytest tests/ -v

Write-Host "`nTests completed!" 