# Deploy API Routes on Vercel - Step by Step

## The Problem
You're getting **404 Not Found** because:
- Your app uses `output: 'export'` (static export)
- Static exports don't include API routes
- API routes need to be deployed separately

## Solution: Configure Vercel to Deploy API Routes

Since you're already deploying to `cognerax.vercel.app`, we just need to configure it to build WITHOUT static export so API routes are included.

### Step 1: Create the Config File (Already Done ✅)
I've created `next.config.vercel.js` which is the same as your current config but WITHOUT `output: 'export'`.

### Step 2: Configure Vercel Build Settings

1. **Go to Vercel Dashboard:**
   - Visit [vercel.com](https://vercel.com)
   - Go to your project: `cognerax`

2. **Open Project Settings:**
   - Click on your project
   - Go to **Settings** tab
   - Click on **General**

3. **Override Build Command:**
   - Scroll down to **Build & Development Settings**
   - Find **Build Command**
   - Click **Override**
   - Enter this command:
     ```bash
     cp next.config.vercel.js next.config.js && npm run build
     ```
   - This will use the Vercel config (without static export) instead of the default one

4. **Set Output Directory:**
   - Make sure **Output Directory** is set to: `.next` (not `out`)
   - If it says `out`, change it to `.next`

### Step 3: Add Environment Variables

1. **Go to Environment Variables:**
   - Still in Settings
   - Click on **Environment Variables**

2. **Add these variables:**
   ```
   RESEND_API_KEY=your_key_here
   RESEND_API_KEY_CONTACT=your_key_here
   RESEND_API_KEY_NEWSLETTER=your_key_here
   RESEND_API_KEY_REQUEST_DEMO=your_key_here
   TURNSTILE_SECRET_KEY=your_key_here
   RESEND_AUDIENCE_ID=your_audience_id_here
   NEXT_PUBLIC_API_BASE_URL=https://cognerax.vercel.app
   ```

3. **Important:** 
   - Select all environments: ☑ Production ☑ Preview ☑ Development
   - Make sure `NEXT_PUBLIC_API_BASE_URL` includes `https://`

### Step 4: Redeploy

1. **Trigger a new deployment:**
   - Go to **Deployments** tab
   - Click the **three dots (⋯)** on your latest deployment
   - Click **Redeploy**
   - OR make a small change and push to Git

2. **Wait for deployment to complete** (2-3 minutes)

### Step 5: Test the API

After deployment, test in your browser console:
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

**Expected Results:**
- ✅ **400** with JSON error → API is working! (validation error is expected)
- ✅ **200** with JSON → API is working perfectly!
- ❌ **404** → Build command not configured correctly
- ❌ **405** → API route exists but method not allowed

## Alternative: Separate API Project

If you prefer to keep static export for the main site and deploy API routes separately:

1. **Create a new Vercel project** for API routes only
2. **Use the same GitHub repo**
3. **Set build command:** `cp next.config.vercel.js next.config.js && npm run build`
4. **Add all environment variables**
5. **Deploy**
6. **Update `NEXT_PUBLIC_API_BASE_URL`** to point to the new API project URL

## Troubleshooting

### Still Getting 404?

1. **Check Vercel build logs:**
   - Go to Deployments → Click on deployment → View Function Logs
   - Look for errors during build

2. **Verify build command:**
   - Make sure it's: `cp next.config.vercel.js next.config.js && npm run build`
   - Check that `next.config.vercel.js` exists in your repo

3. **Check output directory:**
   - Should be `.next` (not `out`)
   - `.next` = Full Next.js app with API routes
   - `out` = Static export (no API routes)

4. **Verify API routes exist:**
   - Check that `app/api/request-demo/route.ts` exists
   - Check that `app/api/contact/route.ts` exists
   - Check that `app/api/newsletter/route.ts` exists

### Getting 405 Instead of 404?

- API routes are deployed but not accepting POST
- Check that the route files export `POST` function
- Check CORS headers in `vercel.json`

## Summary

**Quick Fix:**
1. Override build command in Vercel: `cp next.config.vercel.js next.config.js && npm run build`
2. Set output directory to `.next`
3. Add environment variables
4. Redeploy

After this, `https://cognerax.vercel.app/api/request-demo` should work! 🎉
