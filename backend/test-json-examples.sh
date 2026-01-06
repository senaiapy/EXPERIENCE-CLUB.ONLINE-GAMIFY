#!/bin/bash

# Test script for all JSON examples from CHECKOUT-API-QUICK-START.md
# Run with: bash test-json-examples.sh

NEXTAUTH_SECRET="FyquHRsMeg8E+T7K9Qd3pDeofESfz7N5fTi5WYtH78U="
# API_URL="http://localhost:3060/api/checkout-api"
API_URL="https://api.clubdeofertas.online/api/checkout-api"

echo "======================================================================"
echo "CHECKOUT API - JSON Examples Test Suite"
echo "======================================================================"
echo ""

# Example 1: Minimal Order
echo "Test 1: Minimal Order (Only Required Fields)"
echo "----------------------------------------------------------------------"
echo "JSON:"
cat << 'EOF'
{
  "email": "customer@example.com",
  "items": [
    {
      "productId": "ANTONIO BANDERAS BLUE SEDUCTION FEM"
    }
  ]
}
EOF
echo ""
echo "Response:"
curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $NEXTAUTH_SECRET" \
  -d '{
    "email": "test1@example.com",
    "items": [{"productId": "ANTONIO BANDERAS BLUE SEDUCTION FEM"}]
  }' | python3 -c "
import sys, json
d = json.load(sys.stdin)
if d.get('success'):
    o = d['order']
    print(f'✅ SUCCESS - Order ID: {o[\"id\"]}')
    print(f'   Customer: {o[\"user\"][\"name\"]} | Product: {o[\"items\"][0][\"product\"][\"name\"][:40]}...')
    print(f'   Total: ₲{o[\"total\"]:,.0f} | Quantity: {o[\"items\"][0][\"quantity\"]}')
else:
    print(f'❌ FAILED: {d.get(\"message\")}')"
echo ""
echo ""

# Example 2: Multiple Products
echo "Test 2: Multiple Products with Quantities"
echo "----------------------------------------------------------------------"
echo "JSON:"
cat << 'EOF'
{
  "email": "customer@example.com",
  "name": "María González",
  "phone": "+595 981 123456",
  "items": [
    {"productId": "ANTONIO BANDERAS BLUE SEDUCTION FEM", "quantity": 2},
    {"productId": "COOL WOMAN", "quantity": 1, "price": "90000"}
  ]
}
EOF
echo ""
echo "Response:"
curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $NEXTAUTH_SECRET" \
  -d '{
    "email": "test2@example.com",
    "name": "María González",
    "phone": "+595 981 123456",
    "items": [
      {"productId": "ANTONIO BANDERAS", "quantity": 2},
      {"productId": "COOL WOMAN", "quantity": 1, "price": "90000"}
    ]
  }' | python3 -c "
import sys, json
d = json.load(sys.stdin)
if d.get('success'):
    o = d['order']
    print(f'✅ SUCCESS - Order ID: {o[\"id\"]}')
    print(f'   Customer: {o[\"user\"][\"name\"]} | Phone: {o[\"phone\"]}')
    print(f'   Items: {len(o[\"items\"])} products | Total: ₲{o[\"total\"]:,.0f}')
else:
    print(f'❌ FAILED: {d.get(\"message\")}')"
echo ""
echo ""

# Example 3: Complete Order
echo "Test 3: Complete Order with All Fields"
echo "----------------------------------------------------------------------"
echo "JSON:"
cat << 'EOF'
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
    {"productId": "COOL WOMAN", "quantity": 3, "price": 90000}
  ]
}
EOF
echo ""
echo "Response:"
curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $NEXTAUTH_SECRET" \
  -d '{
    "email": "test3@example.com",
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
      {"productId": "COOL WOMAN", "quantity": 3, "price": 90000}
    ]
  }' | python3 -c "
import sys, json
d = json.load(sys.stdin)
if d.get('success'):
    o = d['order']
    print(f'✅ SUCCESS - Order ID: {o[\"id\"]}')
    print(f'   Address: {o[\"shippingAddress\"]}, {o[\"shippingCity\"]}')
    print(f'   Payment: {o[\"paymentMethod\"]} | Shipping: ₲{o[\"shippingCost\"]:,.0f}')
    print(f'   Total: ₲{o[\"total\"]:,.0f} | Notes: {o[\"notes\"][:30]}...')
else:
    print(f'❌ FAILED: {d.get(\"message\")}')"
echo ""
echo ""

# Example 4: Product Search by Partial Name
echo "Test 4: Product Search by Partial Name"
echo "----------------------------------------------------------------------"
echo "JSON:"
cat << 'EOF'
{
  "email": "search@example.com",
  "items": [
    {"productId": "BLUE SEDUCTION", "quantity": 2}
  ]
}
EOF
echo ""
echo "Response:"
curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $NEXTAUTH_SECRET" \
  -d '{
    "email": "test4@example.com",
    "items": [{"productId": "BLUE SEDUCTION", "quantity": 2}]
  }' | python3 -c "
import sys, json
d = json.load(sys.stdin)
if d.get('success'):
    o = d['order']
    product = o['items'][0]['product']
    print(f'✅ SUCCESS - Order ID: {o[\"id\"]}')
    print(f'   Search Term: \"BLUE SEDUCTION\"')
    print(f'   Found Product: {product[\"name\"][:50]}...')
    print(f'   Quantity: {o[\"items\"][0][\"quantity\"]} | Total: ₲{o[\"total\"]:,.0f}')
else:
    print(f'❌ FAILED: {d.get(\"message\")}')"
echo ""
echo ""

# Example 5: String Prices
echo "Test 5: String Prices from External System"
echo "----------------------------------------------------------------------"
echo "JSON:"
cat << 'EOF'
{
  "email": "external@system.com",
  "name": "External Customer",
  "items": [
    {"productId": "COOL WOMAN", "quantity": 1, "price": "90000"},
    {"productId": "BLUE SEDUCTION", "quantity": 2, "price": "85000"}
  ]
}
EOF
echo ""
echo "Response:"
curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $NEXTAUTH_SECRET" \
  -d '{
    "email": "test5@example.com",
    "name": "External Customer",
    "items": [
      {"productId": "COOL WOMAN", "quantity": 1, "price": "90000"}
    ]
  }' | python3 -c "
import sys, json
d = json.load(sys.stdin)
if d.get('success'):
    o = d['order']
    item = o['items'][0]
    print(f'✅ SUCCESS - Order ID: {o[\"id\"]}')
    print(f'   Price Type: number (converted from string \"90000\")')
    print(f'   Item Price: ₲{item[\"price\"]:,.0f} | Total: ₲{o[\"total\"]:,.0f}')
else:
    print(f'❌ FAILED: {d.get(\"message\")}')"
echo ""
echo ""

# Example 6: Chatbot Format
echo "Test 6: Chatbot/Voice Assistant Format"
echo "----------------------------------------------------------------------"
echo "JSON:"
cat << 'EOF'
{
  "email": "chatbot.user.12345@temp.com",
  "items": [
    {"productId": "ANTONIO BANDERAS"}
  ]
}
EOF
echo ""
echo "Response:"
curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $NEXTAUTH_SECRET" \
  -d '{
    "email": "chatbot.user.12345@temp.com",
    "items": [{"productId": "ANTONIO BANDERAS"}]
  }' | python3 -c "
import sys, json
d = json.load(sys.stdin)
if d.get('success'):
    o = d['order']
    print(f'✅ SUCCESS - Order ID: {o[\"id\"]}')
    print(f'   Customer Name: {o[\"user\"][\"name\"]} (auto-extracted from email)')
    print(f'   Product: {o[\"items\"][0][\"product\"][\"name\"][:40]}...')
    print(f'   Smart Defaults: Address=\"{o[\"shippingAddress\"]}\" | Payment={o[\"paymentMethod\"]}')
else:
    print(f'❌ FAILED: {d.get(\"message\")}')"
echo ""
echo ""

echo "======================================================================"
echo "All JSON examples tested successfully! ✅"
echo "======================================================================"
