# Test the E-Commerce API

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "E-Commerce Backend API Test Script" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$baseUrl = "http://localhost:8080/api/v1"

# Test 1: Check if API is responding
Write-Host "Test 1: Checking API health..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/products" -Method GET
    Write-Host "✓ API is responding (Status: $($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "✗ API is not responding" -ForegroundColor Red
    exit 1
}

# Test 2: Register a new user
Write-Host "`nTest 2: Registering a new user..." -ForegroundColor Yellow
$registerBody = @{
    username = "testuser"
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$baseUrl/auth/register" -Method POST -Body $registerBody -ContentType "application/json"
    Write-Host "✓ User registered successfully" -ForegroundColor Green
} catch {
    if ($_.Exception.Response.StatusCode -eq 500) {
        Write-Host "! User might already exist, continuing..." -ForegroundColor Yellow
    } else {
        Write-Host "✗ Registration failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test 3: Login
Write-Host "`nTest 3: Logging in..." -ForegroundColor Yellow
$loginBody = @{
    username = "testuser"
    password = "password123"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$baseUrl/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
    $loginData = $response.Content | ConvertFrom-Json
    $token = $loginData.token
    Write-Host "✓ Login successful" -ForegroundColor Green
    Write-Host "  Token: $($token.Substring(0, 20))..." -ForegroundColor Gray
    Write-Host "  User ID: $($loginData.id)" -ForegroundColor Gray
    Write-Host "  Roles: $($loginData.roles -join ', ')" -ForegroundColor Gray
} catch {
    Write-Host "✗ Login failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test 4: Get products (authenticated)
Write-Host "`nTest 4: Fetching products..." -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    $response = Invoke-WebRequest -Uri "$baseUrl/products" -Method GET -Headers $headers
    $products = $response.Content | ConvertFrom-Json
    Write-Host "✓ Products fetched successfully" -ForegroundColor Green
    Write-Host "  Total products: $($products.totalElements)" -ForegroundColor Gray
} catch {
    Write-Host "✗ Failed to fetch products: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 5: Get categories
Write-Host "`nTest 5: Fetching categories..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/categories" -Method GET
    $categories = $response.Content | ConvertFrom-Json
    Write-Host "✓ Categories fetched successfully" -ForegroundColor Green
    Write-Host "  Total categories: $($categories.Count)" -ForegroundColor Gray
} catch {
    Write-Host "✗ Failed to fetch categories: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "All tests completed!" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Import postman_collection.json into Postman for full API testing" -ForegroundColor White
Write-Host "2. Create categories and products using the admin endpoints" -ForegroundColor White
Write-Host "3. Test order placement and payment simulation" -ForegroundColor White
Write-Host "`nAPI Documentation: See API_DOCUMENTATION.md" -ForegroundColor White
Write-Host "Quick Start Guide: See QUICKSTART.md`n" -ForegroundColor White
