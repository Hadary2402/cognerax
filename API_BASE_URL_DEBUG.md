# API Base URL Debugging Guide

## Understanding the Cloudflare Warnings

The warnings you're seeing about Cloudflare challenge platform are **harmless browser warnings** and not related to your API configuration. They're just the browser complaining that Cloudflare preloaded some resources that weren't immediately used. You can safely ignore them.

## Verifying Your API Base URL is Set

### Step 1: Check Browser Console

After the page loads, open your browser console and look for:

```
[API Config] API Base URL set to: https://your-api-url.vercel.app
```

If you see this message, your API base URL is configured correctly.

If you see:
```
[API Config] ⚠️ NEXT_PUBLIC_API_BASE_URL is not set!
```

Then the environment variable is not set correctly.

### Step 2: Check the Actual Value

In your browser console, type:
```javascript
window.__API_BASE_URL__
```

This should show your API base URL (e.g., `https://your-api.vercel.app`).

If it shows an empty string `""` or `undefined`, the API base URL is not set.

### Step 3: Check API Endpoints

In your browser console, check what endpoints are being used:
```javascript
// This will show the actual endpoint URLs
console.log('Contact:', window.__API_BASE_URL__ + '/api/contact')
console.log('Request Demo:', window.__API_BASE_URL__ + '/api/request-demo')
console.log('Newsletter:', window.__API_BASE_URL__ + '/api/newsletter')
```

## Common Issues

### Issue 1: Environment Variable Not Set in Vercel

**Symptom:** `window.__API_BASE_URL__` is empty or undefined

**Solution:**
1. Go to Vercel project settings
2. Navigate to Environment Variables
3. Add `NEXT_PUBLIC_API_BASE_URL` with your API deployment URL
4. **Important:** Rebuild your static site after adding the variable

### Issue 2: Environment Variable Set But Not Applied

**Symptom:** Variable is set in Vercel but `window.__API_BASE_URL__` is still empty

**Solution:**
1. The variable must be set **before** building the static site
2. Rebuild your static site: `npm run build`
3. Check `out/index.html` - search for `__API_BASE_URL__` - it should show your URL

### Issue 3: Wrong URL Format

**Symptom:** API base URL is set but requests still fail

**Solution:**
- Make sure the URL doesn't have a trailing slash
- Make sure it's the full URL (e.g., `https://your-api.vercel.app`, not just `/api`)
- Make sure it's the URL where your API routes are deployed

## Testing Your API Endpoint

Once you've verified the API base URL is set, test it:

```javascript
// In browser console
fetch(window.__API_BASE_URL__ + '/api/contact', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({test: true})
})
.then(r => r.text())
.then(text => console.log('Response:', text))
.catch(err => console.error('Error:', err))
```

If you get a JSON response (even an error), your API is reachable.
If you get a 404 or network error, check your API deployment URL.

## Quick Checklist

- [ ] `NEXT_PUBLIC_API_BASE_URL` is set in Vercel environment variables
- [ ] Static site was rebuilt after setting the variable
- [ ] `window.__API_BASE_URL__` shows your API URL in browser console
- [ ] API endpoints show full URLs (not relative paths) in console logs
- [ ] Test fetch request to API endpoint returns a response (not 404)
