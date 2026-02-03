# Fixing CORS and 404 Errors

## The Problems

1. **404 Error**: API routes return 404 because they're not deployed on Vercel
2. **CORS Error**: Requests from `cogneraxai.com` are blocked by CORS policy

## Solution 1: Fix CORS (Already Done ✅)

I've updated all API routes to properly handle CORS:
- Created `lib/cors.ts` with centralized CORS configuration
- Updated all API routes to use the CORS helper
- Added `cogneraxai.com` to allowed origins

## Solution 2: Deploy API Routes on Vercel

The 404 error means your API routes aren't deployed. You need to deploy them to Vercel.

### Step 1: Configure Vercel to Deploy API Routes

1. **Go to Vercel Dashboard:**
   - Visit [vercel.com](https://vercel.com)
   - Go to your project

2. **Override Build Command:**
   - Go to **Settings** → **General**
   - Scroll to **Build & Development Settings**
   - Find **Build Command**
   - Click **Override**
   - Enter: `cp next.config.vercel.js next.config.js && npm run build`
   - This uses the config WITHOUT `output: 'export'` so API routes are included

3. **Set Output Directory:**
   - Make sure **Output Directory** is `.next` (NOT `out`)
   - `.next` = Full Next.js with API routes ✅
   - `out` = Static export (no API routes) ❌

4. **Add Environment Variables:**
   - Go to **Settings** → **Environment Variables**
   - Add all your API keys:
     ```
     RESEND_API_KEY=your_key
     RESEND_API_KEY_CONTACT=your_key
     RESEND_API_KEY_NEWSLETTER=your_key
     RESEND_API_KEY_REQUEST_DEMO=your_key
     TURNSTILE_SECRET_KEY=your_key
     RESEND_AUDIENCE_ID=your_audience_id
     NEXT_PUBLIC_API_BASE_URL=https://cognerax.vercel.app
     ```
   - Select all environments: ☑ Production ☑ Preview ☑ Development

5. **Redeploy:**
   - Go to **Deployments** tab
   - Click **Redeploy** on your latest deployment
   - Wait for deployment to complete

### Step 2: Test the API

After deployment, test in browser console:
```javascript
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
```

**Expected:**
- ✅ **400** with JSON → API is working! (validation error expected)
- ✅ **200** with JSON → Perfect!
- ❌ **404** → API routes not deployed (check build command)
- ❌ **405** → API route exists but method not allowed

### Step 3: Update API Base URL

Once API routes are deployed, make sure your static site uses the correct API URL:

1. **Set `NEXT_PUBLIC_API_BASE_URL` in Vercel:**
   - Use your production Vercel URL: `https://cognerax.vercel.app`
   - NOT the preview URL (the long one with random characters)

2. **Rebuild your static site:**
   ```bash
   npm run build
   ```

3. **Upload to GoDaddy:**
   - Upload the `out` directory
   - Forms will now point to the correct API URL

## Important Notes

### About the Preview URL

The error shows you're using:
```
https://cognerax-ltxta052n-mohamed-elhadarys-projects-71d8c079.vercel.app
```

This is a **preview deployment URL** (temporary). You should use:
```
https://cognerax.vercel.app
```

This is your **production URL** (permanent).

### Setting the Correct API Base URL

1. **In Vercel Environment Variables:**
   - Set `NEXT_PUBLIC_API_BASE_URL=https://cognerax.vercel.app`
   - This will be used when building your static site

2. **After building:**
   - Check `out/index.html`
   - Look for: `window.__API_BASE_URL__ = "https://cognerax.vercel.app"`
   - If it shows the preview URL, the environment variable is wrong

## Summary

**To Fix Both Issues:**

1. ✅ CORS is already fixed (code updated)
2. 📤 Deploy API routes to Vercel:
   - Override build command: `cp next.config.vercel.js next.config.js && npm run build`
   - Set output directory to `.next`
   - Add environment variables
   - Redeploy
3. 🔄 Update API base URL:
   - Set `NEXT_PUBLIC_API_BASE_URL=https://cognerax.vercel.app` (production URL)
   - Rebuild static site
   - Upload to GoDaddy

After these steps, both the 404 and CORS errors should be fixed! 🎉
