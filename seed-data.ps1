# Seed Categories
$headers = @{ "Content-Type" = "application/json" }

# Login as Admin (using default credentials from DataInitializer)
$adminBody = @{ username = "admin"; password = "adminpassword" } | ConvertTo-Json
$loginResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/auth/login" -Method Post -Body $adminBody -Headers $headers
$token = $loginResponse.token
$authHeader = @{ "Authorization" = "Bearer $token"; "Content-Type" = "application/json" }

Write-Host "Logged in as Admin. Token received."

# Create Categories
$cat1 = @{ name = "Electronics"; description = "Gadgets and devices" } | ConvertTo-Json
$cat2 = @{ name = "Books"; description = "Fiction and non-fiction" } | ConvertTo-Json
$cat3 = @{ name = "Clothing"; description = "Men's and Women's fashion" } | ConvertTo-Json

try {
    $c1 = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/categories" -Method Post -Body $cat1 -Headers $authHeader
    $c2 = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/categories" -Method Post -Body $cat2 -Headers $authHeader
    $c3 = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/categories" -Method Post -Body $cat3 -Headers $authHeader
    Write-Host "Categories created."
} catch {
    Write-Host "Categories might already exist or error occurred: $_"
}

# Create Products
$prod1 = @{
    name = "Smartphone X";
    description = "Latest flagship smartphone with 5G";
    price = 999.99;
    stockQuantity = 50;
    categoryId = 1;
    imageUrl = "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80"
} | ConvertTo-Json

$prod2 = @{
    name = "Laptop Pro";
    description = "High performance laptop for professionals";
    price = 1499.99;
    stockQuantity = 30;
    categoryId = 1;
    imageUrl = "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80"
} | ConvertTo-Json

$prod3 = @{
    name = "The Great Gatsby";
    description = "Classic novel by F. Scott Fitzgerald";
    price = 15.99;
    stockQuantity = 100;
    categoryId = 2;
    imageUrl = "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&q=80"
} | ConvertTo-Json

$prod4 = @{
    name = "Wireless Headphones";
    description = "Noise cancelling headphones";
    price = 199.50;
    stockQuantity = 5; 
    categoryId = 1; # Low stock example
    imageUrl = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80"
} | ConvertTo-Json

$prod5 = @{
    name = "Cotton T-Shirt";
    description = "Comfortable cotton t-shirt";
    price = 25.00;
    stockQuantity = 200;
    categoryId = 3;
    imageUrl = "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80"
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "http://localhost:8080/api/v1/products" -Method Post -Body $prod1 -Headers $authHeader
    Invoke-RestMethod -Uri "http://localhost:8080/api/v1/products" -Method Post -Body $prod2 -Headers $authHeader
    Invoke-RestMethod -Uri "http://localhost:8080/api/v1/products" -Method Post -Body $prod3 -Headers $authHeader
    Invoke-RestMethod -Uri "http://localhost:8080/api/v1/products" -Method Post -Body $prod4 -Headers $authHeader
    Invoke-RestMethod -Uri "http://localhost:8080/api/v1/products" -Method Post -Body $prod5 -Headers $authHeader
    Write-Host "Products created successfully!"
} catch {
    Write-Host "Error creating products: $_"
}
