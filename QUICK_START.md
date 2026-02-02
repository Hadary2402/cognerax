# Quick Start Guide - Setting Up API Base URL

## Step 1: Deploy API to Vercel (Get Your API URL)

### 1.1 Push Your Code to GitHub
```bash
# If not already on GitHub:
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/your-repo.git
git push -u origin main
```

### 1.2 Deploy to Vercel
1. Go to https://vercel.com
2. Sign in with GitHub
3. Click "Add New..." → "Project"
4. Import your repository
5. **Configure:**
   - Framework: Next.js (auto-detected)
   - Root Directory: `./` (leave as is)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
   - **DO NOT** check "Override" for any settings

6. **Add Environment Variables:**
   Click "Environment Variables" and add:
   ```
   RESEND_API_KEY=re_9Y9UWUcY_Gs6bcoiRVrqwYcuqwMhNATDj
   RESEND_API_KEY_CONTACT=re_ThdAv52N_D8AYaoquFtx5FHgL23jPpQvc
   RESEND_API_KEY_NEWSLETTER=re_Cm4117QP_M9UFJQkkyyC6H1jP83SXiRiE
   RESEND_API_KEY_REQUEST_DEMO=re_9Y9UWUcY_Gs6bcoiRVrqwYcuqwMhNATDj
   TURNSTILE_SECRET_KEY=your_turnstile_secret_key_here
   RESEND_AUDIENCE_ID=your_audience_id_here
   ```

7. Click "Deploy"

### 1.3 Get Your API Base URL
After deployment completes (2-3 minutes), Vercel will show:
- **Your deployment URL:** `https://your-project-name.vercel.app`
- **This is your API Base URL!** ✅

Copy this URL - you'll need it in the next step.

---

## Step 2: Build Static Site with API URL

### 2.1 Create/Update `.env.local`
Create a file named `.env.local` in your project root:

```bash
NEXT_PUBLIC_API_BASE_URL=https://your-project-name.vercel.app
```

**Replace `your-project-name.vercel.app` with your actual Vercel URL!**

### 2.2 Build Static Site
```bash
npm run build
```

This will:
- Read `NEXT_PUBLIC_API_BASE_URL` from `.env.local`
- Inject it into the built HTML files
- Create the `out` directory with your static site

### 2.3 Verify API URL is Set
After building, check `out/index.html`:
- Open the file
- Look for: `window.__API_BASE_URL__ = "https://your-project-name.vercel.app"`
- If you see your Vercel URL, you're good! ✅

### 2.4 Upload to GoDaddy
1. Upload the entire `out` directory contents to GoDaddy
2. Make sure `.htaccess` is uploaded too
3. Test your forms!

---

## Alternative: Build First, Update Later

If you want to build now and add the API URL later:

1. **Build without API URL:**
   ```bash
   npm run build
   ```

2. **Deploy API to Vercel** (get the URL)

3. **Manually update HTML files:**
   - After uploading to GoDaddy
   - Edit each HTML file in the `out` directory
   - Find: `window.__API_BASE_URL__ = ""`
   - Change to: `window.__API_BASE_URL__ = "https://your-api.vercel.app"`

4. **Re-upload to GoDaddy**

---

## Troubleshooting

### Can't find the API URL in built files?
- Make sure `.env.local` exists in project root
- Make sure it has `NEXT_PUBLIC_API_BASE_URL=...`
- Rebuild: `npm run build`

### Forms still not working?
1. Open browser console on your GoDaddy site
2. Type: `window.__API_BASE_URL__`
3. Should show your Vercel URL
4. If empty, the URL wasn't injected correctly

### Need to change API URL later?
- Update `.env.local`
- Rebuild: `npm run build`
- Re-upload `out` directory to GoDaddy
