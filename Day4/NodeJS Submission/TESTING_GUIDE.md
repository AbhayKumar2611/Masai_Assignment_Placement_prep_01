# Rate Limiter Testing Guide

Complete guide to test the Rate Limiter Middleware implementation.

---

## 🧪 Quick Test Script

Create this script to test all endpoints:

```bash
#!/bin/bash
# test-rate-limiter.sh

echo "======================================"
echo "Rate Limiter Testing Script"
echo "======================================"
echo ""

BASE_URL="http://localhost:3000"

# Test 1: Global Rate Limiter (10 requests/min)
echo "Test 1: Testing Global Rate Limiter (10 req/min)"
echo "Making 15 requests to /test..."
echo ""

for i in {1..15}; do
  echo "Request $i:"
  response=$(curl -s -w "\nHTTP Status: %{http_code}\n" $BASE_URL/test)
  echo "$response"

  # Extract rate limit headers
  headers=$(curl -s -i $BASE_URL/test | grep -i "x-ratelimit")
  echo "$headers"
  echo "---"

  if [ $i -eq 11 ]; then
    echo "⚠️  Should be blocked now (exceeded 10 requests)"
  fi

  sleep 0.5
done

echo ""
echo "======================================"
echo "Test 2: Strict Rate Limiter (5 req/min)"
echo "Making 10 POST requests to /login..."
echo ""

for i in {1..10}; do
  echo "Login Attempt $i:"
  response=$(curl -s -X POST $BASE_URL/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"test123"}' \
    -w "\nHTTP Status: %{http_code}\n")
  echo "$response"
  echo "---"

  if [ $i -eq 6 ]; then
    echo "⚠️  Should be blocked now (exceeded 5 requests)"
  fi

  sleep 0.5
done

echo ""
echo "======================================"
echo "Test 3: Admin Endpoints"
echo ""

echo "Getting all active rate limits:"
curl -s $BASE_URL/admin/rate-limits | json_pp
echo ""

echo "Getting rate limit for localhost (::1):"
curl -s $BASE_URL/admin/rate-limits/::1 | json_pp
echo ""

echo "Resetting rate limit for localhost:"
curl -s -X DELETE $BASE_URL/admin/rate-limits/::1 | json_pp
echo ""

echo "Now testing /test again (should work after reset):"
curl -s $BASE_URL/test | json_pp
echo ""

echo "======================================"
echo "Testing Complete!"
echo "======================================"
```

Make it executable and run:

```bash
chmod +x test-rate-limiter.sh
./test-rate-limiter.sh
```

---

## 🔬 Manual Testing Steps

### Test 1: Basic Rate Limiting

**Step 1:** Start the server

```bash
npm start
```

**Step 2:** Make requests to the test endpoint

```bash
curl http://localhost:3000/test
```

**Step 3:** Repeat 15 times rapidly

```bash
for i in {1..15}; do curl http://localhost:3000/test; echo ""; done
```

**Expected Result:**

- First 10 requests: Success (200)
- Request 11+: Blocked (429)

**Verify Headers:**

```bash
curl -i http://localhost:3000/test
```

Look for:

```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 7
X-RateLimit-Reset: 2024-12-28T15:30:00.000Z
```

---

### Test 2: Strict Rate Limiting (Login)

**Make 10 login attempts:**

```bash
for i in {1..10}; do
  curl -X POST http://localhost:3000/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"test123"}'
  echo ""
done
```

**Expected Result:**

- First 5 requests: Success (200)
- Request 6+: Blocked (429)

---

### Test 3: Lenient Rate Limiting (Public)

**Make 40 requests:**

```bash
for i in {1..40}; do
  curl http://localhost:3000/public
  echo ""
done
```

**Expected Result:**

- First 30 requests: Success (200)
- Request 31+: Blocked (429)

---

### Test 4: Admin Endpoints

**View all active rate limits:**

```bash
curl http://localhost:3000/admin/rate-limits | json_pp
```

**View specific IP:**

```bash
# For localhost
curl http://localhost:3000/admin/rate-limits/::1 | json_pp

# For specific IP
curl http://localhost:3000/admin/rate-limits/192.168.1.100 | json_pp
```

**Reset specific IP:**

```bash
curl -X DELETE http://localhost:3000/admin/rate-limits/::1
```

**Reset all rate limits:**

```bash
curl -X DELETE http://localhost:3000/admin/rate-limits
```

---

### Test 5: Rate Limit Headers

**Check headers in response:**

```bash
curl -i http://localhost:3000/test | grep -i "x-ratelimit"
```

**Expected Headers:**

```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 9
X-RateLimit-Reset: 2024-12-28T15:30:00.000Z
```

---

### Test 6: Retry-After Header

**After hitting rate limit:**

```bash
# Make 11 requests (exceed limit)
for i in {1..11}; do curl http://localhost:3000/test; done

# Check the 11th response headers
curl -i http://localhost:3000/test | grep -i "retry-after"
```

**Expected:**

```
Retry-After: 45
```

---

### Test 7: Wait and Retry

**Test automatic reset:**

```bash
# Hit rate limit
for i in {1..11}; do curl -s http://localhost:3000/test > /dev/null; done

# Verify blocked
echo "Should be blocked:"
curl http://localhost:3000/test

# Wait 61 seconds
echo "Waiting 61 seconds for reset..."
sleep 61

# Try again
echo "Should work now:"
curl http://localhost:3000/test
```

---

## 📊 Postman Collection

### Import this collection:

```json
{
  "info": {
    "name": "Rate Limiter API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Test Routes",
      "item": [
        {
          "name": "Test - Global Rate Limit",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "http://localhost:3000/test",
              "protocol": "http",
              "host": ["localhost"],
              "port": "3000",
              "path": ["test"]
            }
          }
        },
        {
          "name": "Public - Lenient Rate Limit",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "http://localhost:3000/public",
              "protocol": "http",
              "host": ["localhost"],
              "port": "3000",
              "path": ["public"]
            }
          }
        },
        {
          "name": "Login - Strict Rate Limit",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"test@example.com\",\n  \"password\": \"test123\"\n}"
            },
            "url": {
              "raw": "http://localhost:3000/login",
              "protocol": "http",
              "host": ["localhost"],
              "port": "3000",
              "path": ["login"]
            }
          }
        }
      ]
    },
    {
      "name": "Admin Routes",
      "item": [
        {
          "name": "Get All Rate Limits",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "http://localhost:3000/admin/rate-limits",
              "protocol": "http",
              "host": ["localhost"],
              "port": "3000",
              "path": ["admin", "rate-limits"]
            }
          }
        },
        {
          "name": "Get Rate Limit for IP",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "http://localhost:3000/admin/rate-limits/::1",
              "protocol": "http",
              "host": ["localhost"],
              "port": "3000",
              "path": ["admin", "rate-limits", "::1"]
            }
          }
        },
        {
          "name": "Reset Rate Limit for IP",
          "request": {
            "method": "DELETE",
            "header": [],
            "url": {
              "raw": "http://localhost:3000/admin/rate-limits/::1",
              "protocol": "http",
              "host": ["localhost"],
              "port": "3000",
              "path": ["admin", "rate-limits", "::1"]
            }
          }
        },
        {
          "name": "Reset All Rate Limits",
          "request": {
            "method": "DELETE",
            "header": [],
            "url": {
              "raw": "http://localhost:3000/admin/rate-limits",
              "protocol": "http",
              "host": ["localhost"],
              "port": "3000",
              "path": ["admin", "rate-limits"]
            }
          }
        }
      ]
    }
  ]
}
```

### Test with Collection Runner:

1. Import the collection above
2. Click "Run" button
3. Set **Iterations:** 15
4. Set **Delay:** 0ms (or 100ms for slower testing)
5. Click "Run Rate Limiter API"
6. Observe requests being blocked after limit

---

## 🐍 Python Test Script

```python
#!/usr/bin/env python3
import requests
import time

BASE_URL = "http://localhost:3000"

def test_global_rate_limit():
    print("=" * 50)
    print("Test 1: Global Rate Limiter (10 req/min)")
    print("=" * 50)

    for i in range(1, 16):
        response = requests.get(f"{BASE_URL}/test")
        print(f"Request {i}: Status {response.status_code}")

        if 'X-RateLimit-Remaining' in response.headers:
            print(f"  Remaining: {response.headers['X-RateLimit-Remaining']}")

        if response.status_code == 429:
            print(f"  ⚠️  BLOCKED: {response.json()['message']}")
            print(f"  Retry After: {response.headers.get('Retry-After')} seconds")

        time.sleep(0.5)

def test_strict_rate_limit():
    print("\n" + "=" * 50)
    print("Test 2: Strict Rate Limiter (5 req/min)")
    print("=" * 50)

    for i in range(1, 11):
        response = requests.post(f"{BASE_URL}/login", json={
            "email": "test@example.com",
            "password": "test123"
        })
        print(f"Login {i}: Status {response.status_code}")

        if response.status_code == 429:
            print(f"  ⚠️  BLOCKED: {response.json()['message']}")

        time.sleep(0.5)

def test_admin_endpoints():
    print("\n" + "=" * 50)
    print("Test 3: Admin Endpoints")
    print("=" * 50)

    # Get all rate limits
    response = requests.get(f"{BASE_URL}/admin/rate-limits")
    data = response.json()
    print(f"\nActive Rate Limits: {data['count']}")
    for limit in data['rateLimits']:
        print(f"  IP: {limit['ip']}")
        print(f"    Count: {limit['count']}/{limit['limit']}")
        print(f"    Remaining: {limit['remaining']}")
        print(f"    Blocked: {limit['isBlocked']}")

    # Reset all
    response = requests.delete(f"{BASE_URL}/admin/rate-limits")
    print(f"\n{response.json()['message']}")

if __name__ == "__main__":
    test_global_rate_limit()
    test_strict_rate_limit()
    test_admin_endpoints()

    print("\n" + "=" * 50)
    print("All Tests Complete!")
    print("=" * 50)
```

Save as `test_rate_limiter.py` and run:

```bash
chmod +x test_rate_limiter.py
python3 test_rate_limiter.py
```

---

## 🔥 Load Testing

### Using Apache Bench (ab)

```bash
# Install Apache Bench
sudo apt-get install apache2-utils  # Ubuntu/Debian
brew install httpie                  # macOS

# Test with 100 requests, 10 concurrent
ab -n 100 -c 10 http://localhost:3000/test

# View rate limiting in action
ab -n 100 -c 10 -v 2 http://localhost:3000/test | grep "429"
```

### Using wrk

```bash
# Install wrk
brew install wrk  # macOS
sudo apt-get install wrk  # Ubuntu

# Test with 10 connections for 30 seconds
wrk -t10 -c10 -d30s http://localhost:3000/test

# View results
wrk -t10 -c10 -d10s --latency http://localhost:3000/test
```

---

## ✅ Test Checklist

- [ ] Test 1: Global rate limiter blocks after 10 requests
- [ ] Test 2: Strict rate limiter blocks after 5 requests
- [ ] Test 3: Lenient rate limiter blocks after 30 requests
- [ ] Test 4: Rate limit headers are present in responses
- [ ] Test 5: Retry-After header is present when blocked
- [ ] Test 6: Rate limits reset after window expires
- [ ] Test 7: Admin endpoint shows all active rate limits
- [ ] Test 8: Admin endpoint shows specific IP status
- [ ] Test 9: Admin endpoint can reset specific IP
- [ ] Test 10: Admin endpoint can reset all IPs
- [ ] Test 11: Different IPs have independent rate limits
- [ ] Test 12: Automatic cleanup removes expired entries

---

## 📝 Expected Test Results

### Successful Test Output:

```
Request 1: Status 200, Remaining: 9
Request 2: Status 200, Remaining: 8
Request 3: Status 200, Remaining: 7
Request 4: Status 200, Remaining: 6
Request 5: Status 200, Remaining: 5
Request 6: Status 200, Remaining: 4
Request 7: Status 200, Remaining: 3
Request 8: Status 200, Remaining: 2
Request 9: Status 200, Remaining: 1
Request 10: Status 200, Remaining: 0
Request 11: Status 429, BLOCKED ✅
Request 12: Status 429, BLOCKED ✅
Request 13: Status 429, BLOCKED ✅
Request 14: Status 429, BLOCKED ✅
Request 15: Status 429, BLOCKED ✅
```

**All Tests Passed! ✅**

---

## 🎯 Testing Tips

1. **Use Incognito/Private Mode** - Fresh IP/cookies
2. **Test from Different IPs** - Use VPN or different networks
3. **Monitor Console Logs** - Check server output
4. **Use Browser DevTools** - Inspect headers
5. **Test Edge Cases** - Exactly at limit, just over limit
6. **Wait for Reset** - Test that limits actually reset
7. **Test Admin Routes** - Verify management functionality

---

**Happy Testing! 🧪**
