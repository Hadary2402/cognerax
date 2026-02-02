# Fixing Vercel Build Error

## Problem
Vercel error: "Couldn't find any `pages` or `app` directory"

## Solution

### Option 1: Fix Root Directory in Vercel (Recommended)

1. Go to your Vercel project dashboard
2. Click **Settings** → **General**
3. Scroll to **Root Directory**
4. Make sure it's set to **`./`** (project root) or **leave it empty**
5. Click **Save**
6. Go to **Deployments** tab
7. Click the **three dots** (⋯) on the latest deployment
8. Click **Redeploy**

### Option 2: Verify Repository Structure

Make sure your GitHub repository has the `app` directory at the root level:

```
your-repo/
  ├── app/
  │   ├── api/
  │   ├── page.tsx
  │   └── layout.tsx
  ├── components/
  ├── package.json
  ├── next.config.js
  └── ...
```

If your repository structure is different, you may need to:
- Set the **Root Directory** in Vercel to the correct path
- Or reorganize your repository

### Option 3: Check .gitignore

Make sure your `.gitignore` is NOT excluding the `app` directory. It should look like:

```
# Dependencies
node_modules/
/.pnp
.pnp.js

# Testing
/coverage

# Next.js
/.next/
/out/

# Production
/build

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env*.local

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts
```

**Important:** The `app/` directory should NOT be in `.gitignore`

### Option 4: Manual Verification

1. Check your GitHub repository online
2. Make sure you can see the `app` folder in the root
3. If you can't see it, it wasn't committed to Git
4. Run locally:
   ```bash
   git add app/
   git commit -m "Ensure app directory is committed"
   git push
   ```
5. Then redeploy on Vercel

### Option 5: Create vercel.json with Explicit Config

If the above doesn't work, create/update `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "outputDirectory": ".next"
}
```

Then commit and push:
```bash
git add vercel.json
git commit -m "Add Vercel config"
git push
```

### Quick Checklist

- [ ] Root Directory in Vercel is set to `./` or empty
- [ ] `app/` directory exists in GitHub repository root
- [ ] `app/` directory is NOT in `.gitignore`
- [ ] `package.json` exists in repository root
- [ ] `next.config.js` exists in repository root
- [ ] Repository is connected correctly in Vercel

### Still Not Working?

1. **Check Vercel build logs:**
   - Go to your deployment
   - Click on the failed deployment
   - Check the build logs to see what files Vercel can see

2. **Try redeploying:**
   - In Vercel dashboard, go to Deployments
   - Click the three dots (⋯) on latest deployment
   - Click "Redeploy"

3. **Verify Git push:**
   ```bash
   git status
   git log --oneline -5
   ```
   Make sure your latest commit includes the `app` directory
