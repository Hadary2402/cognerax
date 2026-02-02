# Git Setup for Vercel Deployment

## The Problem
Vercel can't find your `app` directory because your code isn't in GitHub yet. Vercel reads from your GitHub repository, so all files need to be committed and pushed.

## Solution: Set Up Git and Push to GitHub

### Step 1: Navigate to Your Project Directory
Open PowerShell/Command Prompt and run:
```powershell
cd "C:\Users\moham\Downloads\cognerax web last version'\cognerax-landingpage-main"
```

### Step 2: Initialize Git (if not already done)
```powershell
git init
```

### Step 3: Add All Files
```powershell
git add .
```

### Step 4: Commit
```powershell
git commit -m "Initial commit - ready for Vercel deployment"
```

### Step 5: Create GitHub Repository
1. Go to https://github.com
2. Click the "+" icon → "New repository"
3. Name it (e.g., `cognerax-landingpage`)
4. **DO NOT** initialize with README, .gitignore, or license
5. Click "Create repository"

### Step 6: Connect and Push
GitHub will show you commands. Run these (replace `YOUR_USERNAME` and `YOUR_REPO_NAME`):

```powershell
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

### Step 7: Connect Vercel to GitHub
1. Go to Vercel dashboard
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Vercel will now see the `app` directory! ✅

## Quick Checklist
- [ ] Navigated to project directory
- [ ] Initialized Git (`git init`)
- [ ] Added files (`git add .`)
- [ ] Committed (`git commit -m "..."`)
- [ ] Created GitHub repository
- [ ] Pushed to GitHub (`git push`)
- [ ] Connected Vercel to GitHub repository

## Verify Files Are in Git
After committing, verify the `app` directory is tracked:
```powershell
git ls-files app/ | Select-Object -First 5
```

You should see files like:
- `app/layout.tsx`
- `app/page.tsx`
- `app/api/contact/route.ts`
- etc.

If you see these files, they're committed and ready to push to GitHub!
