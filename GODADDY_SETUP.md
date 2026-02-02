# GoDaddy Static Hosting Setup Guide

## Problem
GoDaddy shared hosting only supports static files (HTML, CSS, JS). Next.js API routes require a Node.js server, so they won't work on GoDaddy.

## Solution
Host your API routes separately on a Node.js-compatible service (Vercel, Netlify, Railway, etc.) and point your forms to that API.

## Step 1: Deploy API Routes Separately

### Option A: Deploy to Vercel (Recommended - Free)

1. **Create a new Vercel project:**
   - Go to [vercel.com](https://vercel.com)
   - Create a new project
   - Connect your GitHub repository
   - **Important:** In project settings, set the root directory to your project root

2. **Configure Environment Variables in Vercel:**
   - Go to Project Settings → Environment Variables
   - Add all your Resend API keys:
     ```
     RESEND_API_KEY=your_key_here
     RESEND_API_KEY_CONTACT=your_key_here
     RESEND_API_KEY_NEWSLETTER=your_key_here
     RESEND_API_KEY_REQUEST_DEMO=your_key_here
     TURNSTILE_SECRET_KEY=your_key_here
     RESEND_AUDIENCE_ID=your_audience_id_here
     ```

3. **Deploy:**
   - Vercel will automatically deploy
   - Copy your deployment URL (e.g., `https://your-api.vercel.app`)

### Option B: Deploy to Netlify Functions

1. Create a `netlify.toml` file:
   ```toml
   [build]
     functions = "netlify/functions"
   
   [[redirects]]
     from = "/api/*"
     to = "/.netlify/functions/:splat"
     status = 200
   ```

2. Deploy to Netlify and add environment variables

### Option C: Deploy to Railway/Render

Similar process - deploy the Next.js app and add environment variables.

## Step 2: Update Your Static Site

### Method 1: Environment Variable (Build Time)

1. **Create/Update `.env.local`:**
   ```bash
   NEXT_PUBLIC_API_BASE_URL=https://your-api.vercel.app
   ```

2. **Rebuild your static site:**
   ```bash
   npm run build
   ```

3. **Upload the `out` directory to GoDaddy**

### Method 2: Manual Injection (After Build)

If you can't set environment variables, you can manually edit the built HTML:

1. After building, find the script tag in `out/index.html` that sets `__API_BASE_URL__`
2. Update it to:
   ```html
   <script>
     window.__API_BASE_URL__ = "https://your-api.vercel.app";
   </script>
   ```

### Method 3: Edit HTML Files Directly on GoDaddy

1. After uploading to GoDaddy, edit each HTML file
2. Find the script tag with `__API_BASE_URL__`
3. Change it to your API URL

## Step 3: Test

1. Open your GoDaddy site
2. Open browser console
3. Check: `window.__API_BASE_URL__` should show your API URL
4. Try submitting a form
5. Check Network tab - the request should go to your API URL

## Troubleshooting

### Forms still not working?

1. **Check CORS:** Your API server needs to allow requests from `https://cogneraxai.com`
   - For Vercel, add headers in `vercel.json`:
     ```json
     {
       "headers": [
         {
           "source": "/api/(.*)",
           "headers": [
             { "key": "Access-Control-Allow-Origin", "value": "https://cogneraxai.com" },
             { "key": "Access-Control-Allow-Methods", "value": "POST, OPTIONS" },
             { "key": "Access-Control-Allow-Headers", "value": "Content-Type" }
           ]
         }
       ]
     }
     ```

2. **Check API URL:** Make sure `window.__API_BASE_URL__` is set correctly in browser console

3. **Check Network Tab:** Verify requests are going to your API URL, not `/api/...`

## Alternative: Use a Proxy

If you have access to `.htaccess` modifications, you could proxy API requests:

```apache
# In .htaccess, add before other rules:
RewriteCond %{REQUEST_URI} ^/api/(.*)$
RewriteRule ^api/(.*)$ https://your-api.vercel.app/api/$1 [P,L]
```

This requires `mod_proxy` to be enabled on GoDaddy (may not be available on shared hosting).

## Recommended Setup

**Best approach for GoDaddy:**
1. Deploy API to Vercel (free, easy, fast)
2. Set `NEXT_PUBLIC_API_BASE_URL` before building
3. Build static site: `npm run build`
4. Upload `out` directory to GoDaddy
5. Done!
