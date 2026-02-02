# Debugging Form Submission Errors

## Quick Checklist

When you see an error, check the browser console for these specific messages:

### 1. Check API Endpoint Configuration
Look for:
```
[Request Demo Form] API endpoint: https://cognerax.vercel.app/api/request-demo
```

**If you see:**
- ✅ Full URL with `https://` → Configuration is correct
- ❌ Relative path like `/api/request-demo` → API base URL not set
- ❌ URL without `https://` → Protocol will be added automatically

### 2. Check Network Request
Look for:
```
[Request Demo Form] Sending request to: https://cognerax.vercel.app/api/request-demo
[Request Demo Form] Response status: 405
```

**Common Status Codes:**
- **405** = Method Not Allowed → API routes not deployed correctly
- **404** = Not Found → Wrong API URL or routes not deployed
- **500** = Server Error → API deployed but has an error
- **400** = Bad Request → Validation error (check required fields)
- **Network Error** = Can't connect → API not reachable

### 3. Check Error Details
Look for:
```
[Request Demo Form] Error submitting form: ...
[Request Demo Form] Error details: ...
```

## Common Issues and Solutions

### Issue 1: 405 Method Not Allowed

**Symptoms:**
- Console shows: `Response status: 405`
- Error message: "API route not found or method not allowed"

**Cause:**
API routes are not deployed on Vercel, or they're deployed but not configured correctly.

**Solution:**
1. Deploy your API routes to Vercel (without `output: 'export'`)
2. Or create a separate Vercel project for API routes
3. Set `NEXT_PUBLIC_API_BASE_URL` to your API deployment URL

### Issue 2: Network Error / Failed to Fetch

**Symptoms:**
- Console shows: `Network error: Failed to fetch`
- Error message: "Network error: Failed to connect to server"

**Cause:**
- API endpoint is unreachable
- CORS issues
- API not deployed

**Solution:**
1. Verify the API URL is correct
2. Check if API is deployed on Vercel
3. Test the endpoint directly in browser console:
   ```javascript
   fetch('https://cognerax.vercel.app/api/request-demo', {
     method: 'POST',
     headers: {'Content-Type': 'application/json'},
     body: JSON.stringify({test: true})
   })
   .then(r => r.text())
   .then(text => console.log('Response:', text))
   ```

### Issue 3: 404 Not Found

**Symptoms:**
- Console shows: `Response status: 404`
- Error message: "API endpoint not found"

**Cause:**
- Wrong API URL
- API routes not deployed
- Incorrect endpoint path

**Solution:**
1. Check `NEXT_PUBLIC_API_BASE_URL` is set correctly
2. Verify API routes are deployed
3. Check the endpoint path matches your API route file

### Issue 4: 400 Bad Request

**Symptoms:**
- Console shows: `Response status: 400`
- Error message shows validation errors

**Cause:**
- Missing required fields
- Invalid data format
- Turnstile token missing or invalid

**Solution:**
1. Check all required fields are filled
2. Verify Turnstile captcha is completed
3. Check console for specific validation errors

## Testing Your API

### Test 1: Check if API is Deployed
```javascript
// In browser console
fetch('https://cognerax.vercel.app/api/request-demo', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({name: 'test', email: 'test@test.com', company: 'test'})
})
.then(r => {
  console.log('Status:', r.status);
  return r.text();
})
.then(text => console.log('Response:', text))
.catch(err => console.error('Error:', err))
```

**Expected Results:**
- ✅ **400** with JSON error → API is working (validation error expected)
- ✅ **200** with JSON → API is working perfectly
- ❌ **405** → API route not deployed correctly
- ❌ **404** → Wrong URL or API not deployed
- ❌ **Network Error** → API not reachable

### Test 2: Check API Base URL
```javascript
// In browser console
console.log('API Base URL:', window.__API_BASE_URL__);
console.log('Contact Endpoint:', window.__API_BASE_URL__ + '/api/contact');
console.log('Request Demo Endpoint:', window.__API_BASE_URL__ + '/api/request-demo');
console.log('Newsletter Endpoint:', window.__API_BASE_URL__ + '/api/newsletter');
```

## Next Steps

1. **Open browser console** (F12)
2. **Submit the form**
3. **Copy all console logs** starting with `[Request Demo Form]`
4. **Check the response status code**
5. **Follow the solution** for your specific error code

## Still Having Issues?

If you're still getting errors after checking the above:

1. **Share the console logs** - especially:
   - The API endpoint URL
   - The response status code
   - Any error messages

2. **Verify API deployment:**
   - Go to Vercel dashboard
   - Check if API routes are deployed
   - Check Vercel function logs for errors

3. **Check environment variables:**
   - Verify `NEXT_PUBLIC_API_BASE_URL` is set in Vercel
   - Make sure it includes `https://`
   - Rebuild your static site after setting the variable
