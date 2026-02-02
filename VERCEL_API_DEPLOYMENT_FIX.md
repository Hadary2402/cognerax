# Fixing 405 Error - Vercel API Deployment

## The Problem

You're getting a 405 (Method Not Allowed) error because:
1. Your app uses `output: 'export'` which creates a static site
2. Static sites don't include API routes
3. The API routes need to be deployed separately

## Solution: Deploy API Routes to Vercel

You have two options:

### Option 1: Deploy Full Next.js App (Without Static Export) for API Routes

This is the easiest solution - deploy your full Next.js app to Vercel to get API routes working.

**Steps:**

1. **Create a new Vercel project for API routes:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New..." → "Project"
   - Import your GitHub repository

2. **Configure the project:**
   - **Framework Preset:** Next.js
   - **Root Directory:** `./` (leave as is)
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `.next` (default)
   - **Install Command:** `npm install` (default)

3. **IMPORTANT: Override Build Settings:**
   - Go to Project Settings → General
   - Scroll to "Build & Development Settings"
   - Click "Override"
   - **Create a new `next.config.js` file for this deployment:**
   
   Create `next.config.api.js`:
   ```javascript
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     reactStrictMode: true,
     trailingSlash: false,
     // DO NOT use output: 'export' - we need API routes!
     images: {
       unoptimized: true,
     },
   }
   
   module.exports = nextConfig
   ```
   
   Then in Vercel, override the build command to:
   ```bash
   cp next.config.api.js next.config.js && npm run build
   ```

4. **Add Environment Variables:**
   - Go to Project Settings → Environment Variables
   - Add all your API keys:
     ```
     RESEND_API_KEY=your_key
     RESEND_API_KEY_CONTACT=your_key
     RESEND_API_KEY_NEWSLETTER=your_key
     RESEND_API_KEY_REQUEST_DEMO=your_key
     TURNSTILE_SECRET_KEY=your_key
     RESEND_AUDIENCE_ID=your_audience_id
     ```
   - Make sure to select: Production, Preview, and Development

5. **Deploy:**
   - Vercel will automatically deploy
   - Copy your deployment URL (e.g., `https://cognerax-api.vercel.app`)

6. **Update Your Static Site:**
   - Set `NEXT_PUBLIC_API_BASE_URL=https://cognerax-api.vercel.app` (with https://)
   - Rebuild your static site
   - The forms will now point to this API deployment

### Option 2: Use the Same Vercel Project (Recommended)

If `cognerax.vercel.app` is already deployed, you can configure it to support both static export AND API routes:

1. **Create two build configurations:**
   - One for static export (for GoDaddy)
   - One for full Next.js (for Vercel API routes)

2. **Use Vercel's build command override:**
   - In Vercel project settings, override the build command
   - Use a script that detects the deployment target

3. **Or simply remove `output: 'export'` for Vercel:**
   - Create `next.config.vercel.js`:
   ```javascript
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     reactStrictMode: true,
     trailingSlash: false,
     // No output: 'export' - Vercel can handle full Next.js
     images: {
       unoptimized: true,
     },
   }
   
   module.exports = nextConfig
   ```
   
   - In Vercel, override build command:
   ```bash
   cp next.config.vercel.js next.config.js && npm run build
   ```

## Quick Fix: Update Environment Variable

**Most Important:** Make sure your `NEXT_PUBLIC_API_BASE_URL` includes `https://`:

```
NEXT_PUBLIC_API_BASE_URL=https://cognerax.vercel.app
```

NOT:
```
NEXT_PUBLIC_API_BASE_URL=cognerax.vercel.app  ❌ Missing https://
```

The code will now automatically add `https://` if missing, but it's better to set it correctly.

## Testing Your API

After deploying, test your API endpoint:

```javascript
// In browser console
fetch('https://cognerax.vercel.app/api/request-demo', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({test: true})
})
.then(r => r.text())
.then(text => console.log('Response:', text))
.catch(err => console.error('Error:', err))
```

**Expected results:**
- ✅ 400 error with JSON: API is working (validation error is expected)
- ✅ 200 with JSON: API is working perfectly
- ❌ 405 error: API route not deployed correctly
- ❌ 404 error: Wrong URL or API not deployed

## Current Status

Based on your error:
- URL: `cognerax.vercel.app/api/request-demo` (missing https:// - now fixed)
- Error: 405 Method Not Allowed
- **This means the API route exists but doesn't accept POST, OR it's not deployed correctly**

**Next Steps:**
1. Make sure `cognerax.vercel.app` has API routes deployed (not just static files)
2. Check Vercel function logs to see if the API route is being called
3. Verify the API route file exists and exports a POST function
4. Ensure environment variables are set in Vercel
