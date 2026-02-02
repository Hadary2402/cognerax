# Fixing Turnstile Error 300030

## The Problem
Error 300030 means your domain isn't registered in Cloudflare Turnstile.

## Solution: Add Your Domain to Cloudflare Turnstile

### Step 1: Go to Cloudflare Dashboard
1. Visit https://dash.cloudflare.com
2. Sign in to your Cloudflare account
3. Go to **Turnstile** in the sidebar

### Step 2: Find Your Site Key
1. Click on **Sites**
2. Find the site with key: `0x4AAAAAACBPITLIpkr5lgfq`
3. Click on it to edit

### Step 3: Add Your Domains
In the **Domains** section, add:
- `cogneraxai.com` (your production domain)
- `www.cogneraxai.com` (if you use www)
- `*.vercel.app` (for Vercel previews - optional)
- `localhost` (for local development - optional)

### Step 4: Save and Wait
- Click **Save**
- Wait 1-2 minutes for changes to propagate
- Refresh your website

## Alternative: Create a New Site Key for Production

If you can't edit the existing site key:

1. In Cloudflare Turnstile, click **Add Site**
2. Name it: "CogneraX Production"
3. Add domains: `cogneraxai.com`, `www.cogneraxai.com`
4. Copy the new **Site Key**
5. Update your code with the new site key

## Verify It's Working

After adding the domain:
1. Clear browser cache
2. Refresh your website
3. Check browser console - Turnstile errors should be gone
4. Try submitting a form - captcha should work

## Common Issues

### Still Getting Errors?
- Make sure you added the **exact** domain (with or without www)
- Wait 2-3 minutes for DNS propagation
- Clear browser cache
- Check if you're using HTTPS (required for Turnstile)

### Testing Locally?
- Add `localhost` and `127.0.0.1` to Turnstile domains
- Or use a test site key (Cloudflare provides one for testing)
