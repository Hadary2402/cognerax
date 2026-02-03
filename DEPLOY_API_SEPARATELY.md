# Deploy API Routes to Separate Vercel Project

## The Problem

Your main Vercel project (`cognerax.vercel.app`) is serving a static export (for GoDaddy), which doesn't include API routes. That's why you get 404 errors.

## Solution: Create Separate Vercel Project for API Routes

Since you need static export for GoDaddy, deploy API routes to a **separate Vercel project**.

### Step 1: Create New Vercel Project for API

1. **Go to Vercel Dashboard:**
   - Visit [vercel.com](https://vercel.com)
   - Click **Add New...** → **Project**

2. **Import Your Repository:**
   - Select the same GitHub repository
   - Click **Import**

3. **Configure Project Settings:**
   - **Project Name:** `cognerax-api` (or any name you prefer)
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `./` (leave as is)

4. **Override Build Settings:**
   - Click **Override** next to **Build Command**
   - Enter: `cp next.config.vercel.js next.config.js && npm run build`
   - **Output Directory:** `.next` (NOT `out`)
   - Click **Deploy**

### Step 2: Add Environment Variables

1. **Go to Project Settings:**
   - Click on your new API project
   - Go to **Settings** → **Environment Variables**

2. **Add All Required Variables:**
   ```
   RESEND_API_KEY=your_key_here
   RESEND_API_KEY_CONTACT=your_key_here
   RESEND_API_KEY_NEWSLETTER=your_key_here
   RESEND_API_KEY_REQUEST_DEMO=your_key_here
   TURNSTILE_SECRET_KEY=your_key_here
   RESEND_AUDIENCE_ID=your_audience_id_here
   ```
   
3. **Important:**
   - Select all environments: ☑ Production ☑ Preview ☑ Development
   - Click **Save** for each variable

### Step 3: Wait for Deployment

- Vercel will automatically deploy
- Wait 2-3 minutes for deployment to complete
- Copy your new API project URL (e.g., `https://cognerax-api.vercel.app`)

### Step 4: Update Your Static Site

1. **Set API Base URL:**
   - In your **main Vercel project** (the one for static export)
   - Go to **Settings** → **Environment Variables**
   - Add/Update: `NEXT_PUBLIC_API_BASE_URL=https://cognerax-api.vercel.app`
   - Use your new API project URL (NOT the main project URL)

2. **Rebuild Static Site:**
   ```bash
   npm run build
   ```
   This will inject the API base URL into your static site.

3. **Upload to GoDaddy:**
   - Upload the `out` directory
   - Forms will now point to your API project

### Step 5: Test the API

After deployment, test in browser console:
```javascript
fetch('https://cognerax-api.vercel.app/api/request-demo', {
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
- ✅ **200** with JSON → Perfect!
- ❌ **404** → Check build command and output directory
- ❌ **405** → API route exists but method not allowed

## Alternative: Use Same Project with Conditional Build

If you prefer to use the same Vercel project, you can use environment-based builds:

1. **Create `vercel.json` in root:**
   ```json
   {
     "buildCommand": "node -e \"process.env.VERCEL_ENV === 'production' && process.env.API_DEPLOYMENT ? 'cp next.config.vercel.js next.config.js && npm run build' : 'npm run build'\""
   }
   ```

But the **separate project approach is simpler and recommended**.

## Summary

**Two Vercel Projects:**
1. **Main Project** (`cognerax.vercel.app`):
   - Static export for GoDaddy
   - Build command: `npm run build` (default)
   - Output: `out` directory
   - Environment: `NEXT_PUBLIC_API_BASE_URL=https://cognerax-api.vercel.app`

2. **API Project** (`cognerax-api.vercel.app`):
   - Full Next.js with API routes
   - Build command: `cp next.config.vercel.js next.config.js && npm run build`
   - Output: `.next` directory
   - Environment: All Resend keys, Turnstile key, etc.

After this setup, your forms on `cogneraxai.com` will call `https://cognerax-api.vercel.app/api/*` and everything will work! 🎉
