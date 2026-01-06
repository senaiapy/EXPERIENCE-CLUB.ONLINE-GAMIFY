# Checkout API Documentation

## Overview

The Checkout API endpoint allows external services (chatbots, third-party integrations, etc.) to create orders directly without user authentication. It uses **Bearer Token authentication** with the `NEXTAUTH_SECRET` from the environment configuration.

## Endpoint Details

### Create Order

**Endpoint:** `POST /api/checkout-api`

**Authentication:** Bearer Token (NEXTAUTH_SECRET)

**Content-Type:** `application/json`

## Authentication

The endpoint requires a Bearer token that matches the `NEXTAUTH_SECRET` environment variable.

### Example Header:
```
Authorization: Bearer FyquHRsMeg8E+T7K9Qd3pDeofESfz7N5fTi5WYtH78U=
```

### Getting the Token:
The token value is stored in the `.env` file at the project root:
```bash
NEXTAUTH_SECRET="FyquHRsMeg8E+T7K9Qd3pDeofESfz7N5fTi5WYtH78U="
```

## Request Body

### Required Fields

Only **email** and **items** are required. All other fields have intelligent defaults.

```typescript
{
  "email": string,              // Customer email (REQUIRED)
  "items": [                    // Array of order items (REQUIRED, min 1 item)
    {
      "productId": string       // Product ID or Product Name (REQUIRED)
    }
  ]
}
```

### Optional Fields with Smart Defaults

All these fields are **optional** and will use smart defaults if not provided:

```typescript
{
  "name": string,               // Customer name (default: email username, e.g., "test" from "test@example.com")
  "phone": string,              // Contact phone (default: "No phone")
  "shippingAddress": string,    // Shipping address (default: "No address provided")
  "shippingCity": string,       // City (default: "N/A")
  "shippingCountry": string,    // Country (default: "Paraguay")
  "paymentMethod": enum,        // CASH | CREDIT_CARD | DEBIT_CARD | BANK_TRANSFER (default: "CASH")
  "postalCode": string,         // Postal code (default: null)
  "shippingCost": number,       // Shipping cost in USD (default: 0)
  "tax": number,                // Tax amount in USD (default: 0)
  "notes": string,              // Additional notes (default: null)
  "items": [
    {
      "productId": string,      // Product ID OR product name (searches by name, slug, or referenceId)
      "quantity": number,       // Quantity (default: 1 if not provided)
      "price": number | string  // Price in USD (default: uses product DB price, accepts string "90000" or number 90000)
    }
  ]
}
```

### Smart Features

1. **Product Search**: `productId` can be:
   - Actual product ID: `"cmh98c2il031wsqqvhmi46wyg"`
   - Product name (partial match, case-insensitive): `"COOL WOMAN"`
   - Product slug (partial match): `"new-brand-name-cool-woman"`
   - Product reference ID: `"000000803"`

2. **Price Flexibility**:
   - ✅ Omit price → automatically uses database price
   - ✅ String price `"90000"` → converts to number `90000`
   - ✅ Number price `90000` → uses as-is

3. **Quantity Default**: If omitted, defaults to `1`

4. **Customer Name**: If omitted, extracts from email (`"customer@example.com"` → `"customer"`)

5. **Shipping Defaults**: All shipping fields default to safe values for incomplete data

## Request Examples

### Minimal Example (Only Required Fields)

```bash
curl -X POST "http://localhost:3060/api/checkout-api" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer FyquHRsMeg8E+T7K9Qd3pDeofESfz7N5fTi5WYtH78U=" \
  -d '{
    "email": "customer@example.com",
    "items": [
      {
        "productId": "COOL WOMAN"
      }
    ]
  }'
```

### Complete Example (All Fields)

```bash
curl -X POST "http://localhost:3060/api/checkout-api" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer FyquHRsMeg8E+T7K9Qd3pDeofESfz7N5fTi5WYtH78U=" \
  -d '{
    "email": "customer@example.com",
    "name": "María González",
    "phone": "+595 981 654321",
    "shippingAddress": "Av. España 5678",
    "shippingCity": "Asunción",
    "shippingCountry": "Paraguay",
    "postalCode": "5678",
    "paymentMethod": "CASH",
    "shippingCost": 10.0,
    "tax": 0,
    "notes": "Please call before delivery",
    "items": [
      {
        "productId": "cmh98c2il031wsqqvhmi46wyg",
        "quantity": 2,
        "price": 90000
      }
    ]
  }'
```

## Response

### Success Response (201 Created)

```json
{
  "success": true,
  "message": "Order created successfully",
  "order": {
    "id": "cmhgptaxs0007sq0sh4cdptza",
    "userId": "cmhgptaxi0005sq0st3hpee5k",
    "total": 90010,
    "subtotal": 90000,
    "tax": 0,
    "shippingCost": 10,
    "status": "PENDING",
    "paymentMethod": "CASH",
    "paymentStatus": "UNPAID",
    "shippingAddress": "Av. España 5678",
    "shippingCity": "Asunción",
    "shippingCountry": "Paraguay",
    "postalCode": "5678",
    "phone": "+595 981 654321",
    "notes": "Please call before delivery",
    "createdAt": "2025-11-01T20:08:46.240Z",
    "updatedAt": "2025-11-01T20:08:46.240Z",
    "user": {
      "id": "cmhgptaxi0005sq0st3hpee5k",
      "email": "customer@example.com",
      "name": "María González",
      "phone": "+595 981 654321"
    },
    "items": [
      {
        "id": "cmhgptaxs0009sq0sr694wgzl",
        "orderId": "cmhgptaxs0007sq0sh4cdptza",
        "productId": "cmh98c2il031wsqqvhmi46wyg",
        "quantity": 2,
        "price": 90000,
        "product": {
          "id": "cmh98c2il031wsqqvhmi46wyg",
          "name": "Product Name",
          "price": 90000,
          "stock": 98,
          "images": [...],
          "brand": {...},
          "category": {...}
        }
      }
    ]
  }
}
```

### Error Responses

#### 401 Unauthorized - Missing Token
```json
{
  "message": "Authorization header is required",
  "error": "Unauthorized",
  "statusCode": 401
}
```

#### 401 Unauthorized - Invalid Token
```json
{
  "message": "Invalid API token",
  "error": "Unauthorized",
  "statusCode": 401
}
```

#### 400 Bad Request - Empty Items
```json
{
  "message": "Order must contain at least one item",
  "error": "Bad Request",
  "statusCode": 400
}
```

#### 400 Bad Request - Insufficient Stock
```json
{
  "message": "Insufficient stock for product: Product Name. Available: 5, Requested: 10",
  "error": "Bad Request",
  "statusCode": 400
}
```

#### 400 Bad Request - Price Mismatch
```json
{
  "message": "Price mismatch for product: Product Name. Expected: 100, Received: 90",
  "error": "Bad Request",
  "statusCode": 400
}
```

#### 404 Not Found - Product Not Found
```json
{
  "message": "Product not found: invalid-product-id",
  "error": "Not Found",
  "statusCode": 404
}
```

## Business Logic

### User Creation
- If a user with the provided email doesn't exist, a new user is automatically created
- Guest users are created with an empty password and USER role
- User information is stored for future orders

### Stock Management
- Product stock is validated before order creation
- Stock is decremented atomically during order creation
- Transaction ensures data consistency

### Price Validation
- Product prices are validated against the database
- Prevents price manipulation attacks
- Allows a tolerance of 0.01 for floating-point precision

### Order Calculations
- **Subtotal:** Sum of (price × quantity) for all items
- **Total:** subtotal + shippingCost + tax

## Security Features

1. **Bearer Token Authentication**: Only requests with valid NEXTAUTH_SECRET are processed
2. **Price Validation**: Prevents price manipulation by verifying against database prices
3. **Stock Validation**: Ensures sufficient inventory before order creation
4. **Atomic Transactions**: Uses Prisma transactions to ensure data consistency
5. **Input Validation**: All inputs are validated using class-validator decorators

## Integration Example (Node.js)

```javascript
const axios = require('axios');

async function createOrder(orderData) {
  try {
    const response = await axios.post(
      'http://localhost:3060/api/checkout-api',
      orderData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXTAUTH_SECRET}`
        }
      }
    );

    console.log('Order created:', response.data.order.id);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error.response?.data || error.message);
    throw error;
  }
}

// Usage
createOrder({
  email: 'customer@example.com',
  name: 'Juan Pérez',
  phone: '+595 981 123456',
  shippingAddress: 'Av. Mcal. López 1234',
  shippingCity: 'Asunción',
  shippingCountry: 'Paraguay',
  paymentMethod: 'CASH',
  items: [
    {
      productId: 'cmh98c2il031wsqqvhmi46wyg',
      quantity: 2,
      price: 90000
    }
  ]
});
```

## Testing

### Test Script Location
A comprehensive test script is available at:
```
/tmp/test-checkout-api.sh
```

### Run Tests
```bash
bash /tmp/test-checkout-api.sh
```

The test script covers:
1. ✅ Missing authorization header (401)
2. ✅ Invalid token (401)
3. ✅ Valid token with empty items (400)
4. ✅ Valid token with valid order (201)

## Swagger Documentation

The endpoint is documented in Swagger UI:
- **URL:** http://localhost:3060/api/docs
- **Tag:** Checkout API
- **Security:** API-Token (Bearer)

## Payment Methods

Available payment methods (from Prisma schema):
- `CASH` - Cash on delivery
- `CREDIT_CARD` - Credit card payment
- `DEBIT_CARD` - Debit card payment
- `BANK_TRANSFER` - Bank transfer

## Order Status Flow

After creation, orders have the following default status:
- **status:** `PENDING`
- **paymentStatus:** `UNPAID`

Admins can update these statuses through the admin panel or orders API.

## Production Deployment

### Environment Configuration
Ensure `NEXTAUTH_SECRET` is properly configured in production:

```bash
# .env (production)
NEXTAUTH_SECRET="your-secure-production-secret"
```

### URL
In production, the endpoint will be available at:
```
https://api.experience-club.online/api/checkout-api
```

## Rate Limiting

Consider implementing rate limiting for this endpoint in production to prevent abuse:
- Recommended: 10 requests per minute per IP
- Use NestJS throttler module

## Monitoring

Key metrics to monitor:
- Order creation success rate
- Failed authentication attempts
- Stock-related errors
- Price validation failures
- Average order value

## Support

For issues or questions:
- Check Swagger documentation: http://localhost:3060/api/docs
- Review application logs
- Contact backend team

## Advanced Features

### Flexible Data Handling

The API intelligently handles incomplete or varied data formats:

**Example 1: Minimal Order (Chatbot/Voice Assistant)**
```json
{
  "email": "customer@example.com",
  "items": [{"productId": "COOL WOMAN"}]
}
```
Result: Creates order with quantity=1, uses DB price, defaults for shipping info

**Example 2: String Price from External System**
```json
{
  "email": "customer@example.com",
  "items": [
    {
      "productId": "cmh98c2il031wsqqvhmi46wyg",
      "quantity": 2,
      "price": "90000"
    }
  ]
}
```
Result: Converts "90000" string to 90000 number automatically

**Example 3: Product Search by Name**
```json
{
  "email": "customer@example.com",
  "items": [
    {
      "productId": "COOL",
      "quantity": 3
    }
  ]
}
```
Result: Searches products containing "COOL" in name/slug/reference, uses DB price

### Use Cases

1. **Chatbot Integration**: Send minimal data, API fills in defaults
2. **Voice Assistants**: Product search by name instead of ID
3. **External Systems**: Accept string prices from systems without type conversion
4. **Quick Checkout**: Only email + product needed for express orders
5. **Partial Data Recovery**: Handles incomplete webhook/API data gracefully

## Changelog

### Version 1.1.0 (2025-11-01)
- **NEW:** Smart defaults for all optional fields
- **NEW:** Product search by name, slug, or reference ID (not just ID)
- **NEW:** Auto-convert string prices to numbers
- **NEW:** Default quantity to 1 if not provided
- **NEW:** Default price to DB price if not provided
- **IMPROVED:** Only email and items are required now
- **IMPROVED:** Customer name defaults to email username
- **IMPROVED:** Shipping fields default to safe fallback values

### Version 1.0.0 (2025-11-01)
- Initial release
- Bearer token authentication with NEXTAUTH_SECRET
- Order creation with automatic user creation
- Stock validation and management
- Price validation
- Transaction-based order processing
