sis, here are the curl commands to search for "givenchy" products:

  Basic Search (Recommended)

  curl -X GET "http://localhost:3062/api/products?search=givenchy&page=1&limit=20" \
    -H "Content-Type: application/json"


  curl -X GET "https://api.experience-club.online/api/products?search=givenchy&page=1&limit=20" \
    -H "Content-Type: application/json"
  Alternative Search Methods

curl -X GET "https://api.clubdeofertas.online/api/products?search=givenchy&page=1&limit=1" \
    -H "Content-Type: application/json"

https://api.experience-club.online/api/products?search=givenchy&page=1&limit=1
https://api.clubdeofertas.online/api/products?search=givenchy&page=1&limit=1

  Alternative Search Methods


  1. Search by value endpoint:
  curl -X GET "http://localhost:3062/api/products/search/value/givenchy?page=1&limit=20" \
    -H "Content-Type: application/json"

  2. Search in brand column specifically:
  curl -X GET "http://localhost:3062/api/products/search/column/brand_name/givenchy?page=1&limit=20" \
    -H "Content-Type: application/json"

  With Additional Filters

  With price range and sorting:
  curl -X GET "http://localhost:3062/api/products?search=givenchy&page=1&limit=20&minPrice=10&maxPrice=200&sortBy=price&sortOrder=asc" \
    -H "Content-Type: application/json"

  Only in-stock products:
  curl -X GET "http://localhost:3062/api/products?search=givenchy&page=1&limit=20&stockStatus=En%20stock" \
    -H "Content-Type: application/json"

  Frontend URL (Browser)

  If you want to test directly in the browser:
  http://localhost:3060?search=givenchy

  Backend API Documentation

  For complete API documentation, visit:
  http://localhost:3062/api/docs