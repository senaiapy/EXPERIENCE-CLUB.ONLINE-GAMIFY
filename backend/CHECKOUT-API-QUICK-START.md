# Checkout API - Quick Start Guide

## Basic Info

**Endpoint:** `POST /api/checkout-api`
**Auth Token:** `FyquHRsMeg8E+T7K9Qd3pDeofESfz7N5fTi5WYtH78U=`
**Port (Dev):** 3060
**Port (Production):** 3062

## Minimal Request (Only 2 fields required!)

```bash
curl -X POST "http://localhost:3060/api/checkout-api" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer FyquHRsMeg8E+T7K9Qd3pDeofESfz7N5fTi5WYtH78U=" \
  -d '{
    "email": "customer@example.com",
    "items": [{"productId": "PRODUCT NAME"}]
  }'
```

## What Happens Automatically

| Field Not Provided | Auto-Generated Value |
|-------------------|---------------------|
| `name` | Extracted from email (e.g., "test" from "test@example.com") |
| `phone` | "No phone" |
| `shippingAddress` | "No address provided" |
| `shippingCity` | "N/A" |
| `shippingCountry` | "Paraguay" |
| `paymentMethod` | "CASH" |
| `quantity` | 1 |
| `price` | Product price from database |

## Product Search Options

The `productId` field accepts any of these:
- ✅ Product ID: `"cmh98c2il031wsqqvhmi46wyg"`
- ✅ Product Name: `"COOL WOMAN"` (partial match, case-insensitive)
- ✅ Product Slug: `"cool-woman-100ml"`
- ✅ Reference ID: `"000000803"`

## Price Flexibility

All these formats work:
- ✅ `"price": 90000` (number)
- ✅ `"price": "90000"` (string - auto-converts)
- ✅ No price field (uses DB price)

## Common Use Cases

### 1. Chatbot Order (Minimal Data)
```json
{
  "email": "chatbot@user.com",
  "items": [{"productId": "PERFUME"}]
}
```

### 2. External System (String Prices)
```json
{
  "email": "external@system.com",
  "items": [
    {
      "productId": "cmh98c2il031wsqqvhmi46wyg",
      "quantity": 2,
      "price": "90000"
    }
  ]
}
```

### 3. Voice Assistant (By Product Name)
```json
{
  "email": "voice@assistant.com",
  "name": "Voice User",
  "items": [
    {
      "productId": "COOL WOMAN",
      "quantity": 3
    }
  ]
}
```

### 4. Complete Order
```json
{
  "email": "customer@example.com",
  "name": "María González",
  "phone": "+595 981 123456",
  "shippingAddress": "Av. España 123",
  "shippingCity": "Asunción",
  "shippingCountry": "Paraguay",
  "paymentMethod": "CREDIT_CARD",
  "shippingCost": 15.0,
  "items": [
    {
      "productId": "cmh98c2il031wsqqvhmi46wyg",
      "quantity": 2,
      "price": 90000
    }
  ],
  "notes": "Call before delivery"
}
```

## Response Format

### Success (201)
```json
{
  "success": true,
  "message": "Order created successfully",
  "order": {
    "id": "cmhgq56js000rsqlurvewekmu",
    "total": 90000,
    "status": "PENDING",
    "paymentStatus": "UNPAID",
    "user": {...},
    "items": [...]
  }
}
```

### Error (400/401/404)
```json
{
  "message": "Error description",
  "error": "Error Type",
  "statusCode": 400
}
```

## Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| 401 Unauthorized | Missing/invalid token | Add `Authorization: Bearer TOKEN` header |
| 400 Bad Request - Empty items | No items in order | Add at least one item |
| 404 Not Found | Product not found | Check product name/ID exists |
| 400 Insufficient stock | Not enough inventory | Reduce quantity or choose another product |

## Testing Script

Save and run this test:

```bash
#!/bin/bash
NEXTAUTH_SECRET="FyquHRsMeg8E+T7K9Qd3pDeofESfz7N5fTi5WYtH78U="

curl -X POST "http://localhost:3060/api/checkout-api" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $NEXTAUTH_SECRET" \
  -d '{
    "email": "test@example.com",
    "items": [{"productId": "COOL WOMAN"}]
  }' | python3 -m json.tool
```

## Integration Examples

### JavaScript/Node.js
```javascript
const axios = require('axios');

async function createOrder(email, productName) {
  const response = await axios.post(
    'http://localhost:3060/api/checkout-api',
    {
      email: email,
      items: [{ productId: productName }]
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer FyquHRsMeg8E+T7K9Qd3pDeofESfz7N5fTi5WYtH78U='
      }
    }
  );
  return response.data;
}

// Usage
createOrder('customer@example.com', 'COOL WOMAN')
  .then(data => console.log('Order ID:', data.order.id));
```

### Python
```python
import requests

def create_order(email, product_name):
    response = requests.post(
        'http://localhost:3060/api/checkout-api',
        json={
            'email': email,
            'items': [{'productId': product_name}]
        },
        headers={
            'Content-Type': 'application/json',
            'Authorization': 'Bearer FyquHRsMeg8E+T7K9Qd3pDeofESfz7N5fTi5WYtH78U='
        }
    )
    return response.json()

# Usage
result = create_order('customer@example.com', 'COOL WOMAN')
print('Order ID:', result['order']['id'])
```

### PHP
```php
<?php
function createOrder($email, $productName) {
    $ch = curl_init('http://localhost:3060/api/checkout-api');

    $data = json_encode([
        'email' => $email,
        'items' => [['productId' => $productName]]
    ]);

    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Authorization: Bearer FyquHRsMeg8E+T7K9Qd3pDeofESfz7N5fTi5WYtH78U='
    ]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $response = curl_exec($ch);
    curl_close($ch);

    return json_decode($response, true);
}

// Usage
$result = createOrder('customer@example.com', 'COOL WOMAN');
echo 'Order ID: ' . $result['order']['id'];
?>
```

## JSON Request Examples

### Example 1: Minimal Order (Only Required Fields)
```json
{
  "email": "customer@example.com",
  "items": [
    {
      "productId": "ANTONIO BANDERAS BLUE SEDUCTION FEM"
    }
  ]
}
```

**What happens:**
- ✅ Customer name: `"customer"` (from email)
- ✅ Quantity: `1` (default)
- ✅ Price: Uses database price automatically
- ✅ Shipping: `"No address provided"`
- ✅ Payment: `"CASH"` (default)

### Example 2: Multiple Products with Quantities
```json
{
  "email": "customer@example.com",
  "name": "María González",
  "phone": "+595 981 123456",
  "items": [
    {
      "productId": "ANTONIO BANDERAS BLUE SEDUCTION FEM",
      "quantity": 2
    },
    {
      "productId": "COOL WOMAN",
      "quantity": 1,
      "price": "90000"
    }
  ]
}
```

### Example 3: Complete Order with All Fields
```json
{
  "email": "customer@example.com",
  "name": "Juan Pérez",
  "phone": "+595 981 654321",
  "shippingAddress": "Av. Mariscal López 1234",
  "shippingCity": "Asunción",
  "shippingCountry": "Paraguay",
  "postalCode": "1209",
  "paymentMethod": "CREDIT_CARD",
  "shippingCost": 25000,
  "tax": 0,
  "notes": "Entregar entre 9am y 5pm",
  "items": [
    {
      "productId": "cmh98c2il031wsqqvhmi46wyg",
      "quantity": 3,
      "price": 90000
    }
  ]
}
```

### Example 4: Product Search by Partial Name
```json
{
  "email": "search@example.com",
  "items": [
    {
      "productId": "BLUE SEDUCTION",
      "quantity": 2
    }
  ]
}
```

**What happens:**
- ✅ Searches for products containing "BLUE SEDUCTION"
- ✅ Finds: "ANTONIO BANDERAS BLUE SEDUCTION FEM"
- ✅ Uses database price automatically

### Example 5: String Prices from External System
```json
{
  "email": "external@system.com",
  "name": "External Customer",
  "items": [
    {
      "productId": "COOL WOMAN",
      "quantity": 1,
      "price": "90000"
    },
    {
      "productId": "BLUE SEDUCTION",
      "quantity": 2,
      "price": "85000"
    }
  ]
}
```

**What happens:**
- ✅ String prices `"90000"` automatically convert to numbers
- ✅ Validates each price against database (prevents manipulation)

### Example 6: Chatbot/Voice Assistant Format
```json
{
  "email": "chatbot.user.12345@temp.com",
  "items": [
    {
      "productId": "ANTONIO BANDERAS"
    }
  ]
}
```

**What happens:**
- ✅ Customer name: `"chatbot.user.12345"` (from email)
- ✅ Searches products containing "ANTONIO BANDERAS"
- ✅ Creates order with all smart defaults

## Payment Methods

- `CASH` - Cash on delivery (default)
- `CREDIT_CARD` - Credit card
- `DEBIT_CARD` - Debit card
- `BANK_TRANSFER` - Bank transfer

## Order Status Flow

1. **Created** → `status: PENDING`, `paymentStatus: UNPAID`
2. **Admin Updates** → Changes status via admin panel
3. **Completion** → `status: DELIVERED`, `paymentStatus: PAID`

## Test Scripts

Run these test scripts to verify the API:

```bash
# Test all JSON examples from this guide
bash backend/test-json-examples.sh

# Test flexible features
bash /tmp/test-flexible-checkout.sh

# Complete demo
bash /tmp/final-demo-test.sh
```

## Need More Info?

- **Full Documentation:** [CHECKOUT-API-DOCS.md](./CHECKOUT-API-DOCS.md)
- **Swagger UI:** http://localhost:3060/api/docs
- **Test Scripts:**
  - `backend/test-json-examples.sh` - Tests all JSON examples
  - `/tmp/test-flexible-checkout.sh` - Flexible features test
  - `/tmp/final-demo-test.sh` - Comprehensive demo

## Production URL

```
https://api.experience-club.online/api/checkout-api
```

Remember to update the token in production!
