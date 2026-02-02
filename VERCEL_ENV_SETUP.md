# Setting Up Environment Variables in Vercel

## Step-by-Step Guide

### Step 1: Access Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Sign in to your account
3. Click on your project (e.g., `cognerax`)

### Step 2: Navigate to Environment Variables
1. Click on the **Settings** tab (top navigation)
2. Click on **Environment Variables** in the left sidebar

### Step 3: Add All Required Variables

Click **Add New** for each variable below. **Important:** Select all three environments (Production, Preview, Development) for each variable.

#### 1. Resend API Keys

**General Resend API Key (Fallback):**
```
Name: RESEND_API_KEY
Value: re_9Y9UWUcY_Gs6bcoiRVrqwYcuqwMhNATDj
Environment: ☑ Production  ☑ Preview  ☑ Development
```

**Contact Form API Key:**
```
Name: RESEND_API_KEY_CONTACT
Value: re_ThdAv52N_D8AYaoquFtx5FHgL23jPpQvc
Environment: ☑ Production  ☑ Preview  ☑ Development
```

**Newsletter API Key:**
```
Name: RESEND_API_KEY_NEWSLETTER
Value: re_Cm4117QP_M9UFJQkkyyC6H1jP83SXiRiE
Environment: ☑ Production  ☑ Preview  ☑ Development
```

**Request Demo API Key:**
```
Name: RESEND_API_KEY_REQUEST_DEMO
Value: re_9Y9UWUcY_Gs6bcoiRVrqwYcuqwMhNATDj
Environment: ☑ Production  ☑ Preview  ☑ Development
```

#### 2. Turnstile Secret Key (CRITICAL!)

```
Name: TURNSTILE_SECRET_KEY
Value: [Your Turnstile Secret Key - see instructions below]
Environment: ☑ Production  ☑ Preview  ☑ Development
```

**How to find your Turnstile Secret Key:**
1. Go to https://dash.cloudflare.com
2. Log in to your Cloudflare account
3. Navigate to **Turnstile** in the sidebar
4. Find your site (the one with site key `0x4AAAAAACBPITLIpkr5lgfq`)
5. Click on it to view details
6. You'll see the **Secret Key** - copy it (it's different from the site key)
7. Paste it as the value above

**Important:** 
- **Site Key** (`0x4AAAAAACBPITLIpkr5lgfq`) = Used in frontend (already in your code)
- **Secret Key** = Used in backend API (must be in Vercel env vars)

#### 3. Resend Audience ID (for Newsletter)

```
Name: RESEND_AUDIENCE_ID
Value: [Your Audience ID - see instructions below]
Environment: ☑ Production  ☑ Preview  ☑ Development
```

**How to find your Resend Audience ID:**
1. Go to https://resend.com/audiences
2. Log in to your Resend account
3. Find your audience (or create one if you haven't)
4. Click on the audience
5. Copy the **Audience ID** (usually a UUID like `babde18b-c97b-461a-9d8c-205211faa504`)
6. Paste it as the value above

#### 4. Public API Base URL (Optional - for static builds)

```
Name: NEXT_PUBLIC_API_BASE_URL
Value: https://cognerax.vercel.app
Environment: ☑ Production  ☑ Preview  ☑ Development
```

**Note:** This is the URL where your API routes are deployed (your Vercel project URL).

### Step 4: Verify All Variables Are Added

After adding all variables, you should see them listed in the Environment Variables page. Make sure:
- ✅ All variables are present
- ✅ All have Production, Preview, and Development selected
- ✅ Values are correct (no typos)

### Step 5: Redeploy Your Project

**IMPORTANT:** Environment variables only apply to NEW deployments. You must redeploy after adding variables.

**Option 1: Redeploy from Dashboard**
1. Go to the **Deployments** tab
2. Find your latest deployment
3. Click the **three dots (⋯)** menu
4. Click **Redeploy**
5. Wait for deployment to complete

**Option 2: Trigger New Deployment**
1. Make a small change to your code (or just push to Git)
2. Vercel will automatically deploy
3. The new deployment will use the updated environment variables

### Step 6: Verify It's Working

1. **Check Vercel Logs:**
   - Go to **Deployments** tab
   - Click on your latest deployment
   - Go to **Functions** tab
   - Try submitting a form
   - Check the logs - you should see:
     - `[Contact API] API key found`
     - `[Contact API] Turnstile verification successful`
     - `[Contact API] Email sent successfully`

2. **Test Form Submissions:**
   - Go to your production website
   - Submit the contact form
   - Submit the newsletter form
   - Submit the request demo form
   - Check your email (`cognerax@outlook.com`) for notifications

3. **Check for Errors:**
   - If you see `TURNSTILE_SECRET_KEY is not configured` → Secret key is missing
   - If you see `RESEND_API_KEY is not configured` → API key is missing
   - If you see `Turnstile verification failed` → Secret key is incorrect or domain mismatch

## Quick Checklist

Before deploying, make sure you have:

- [ ] `RESEND_API_KEY` (general fallback)
- [ ] `RESEND_API_KEY_CONTACT`
- [ ] `RESEND_API_KEY_NEWSLETTER`
- [ ] `RESEND_API_KEY_REQUEST_DEMO`
- [ ] `TURNSTILE_SECRET_KEY` (from Cloudflare)
- [ ] `RESEND_AUDIENCE_ID` (from Resend)
- [ ] `NEXT_PUBLIC_API_BASE_URL` (optional, for static builds)
- [ ] All variables have Production, Preview, and Development selected
- [ ] Redeployed after adding variables

## Troubleshooting

### "Email service not configured"
- **Cause:** Resend API key is missing or incorrect
- **Fix:** Check that `RESEND_API_KEY_*` variables are set correctly in Vercel

### "Turnstile verification failed"
- **Cause:** Secret key is missing, incorrect, or domain mismatch
- **Fix:** 
  1. Verify `TURNSTILE_SECRET_KEY` is set in Vercel
  2. Make sure you copied the **Secret Key** (not Site Key)
  3. Ensure your production domain is added to Turnstile in Cloudflare
  4. Redeploy after adding the secret key

### "Audience ID not configured"
- **Cause:** `RESEND_AUDIENCE_ID` is missing
- **Fix:** Add `RESEND_AUDIENCE_ID` to Vercel environment variables

### Variables not working after adding
- **Cause:** Didn't redeploy after adding variables
- **Fix:** Redeploy your project (old deployments don't get new env vars)

## Security Notes

- ✅ Never commit `.env.local` to Git (it's already in `.gitignore`)
- ✅ Environment variables in Vercel are encrypted at rest
- ✅ Only team members with access to your Vercel project can see env vars
- ✅ Use different API keys for different forms (already configured)
- ✅ Secret keys should never be exposed in frontend code

## Need Help?

If you're still having issues:
1. Check Vercel function logs for specific error messages
2. Verify all environment variable names match exactly (case-sensitive)
3. Make sure you redeployed after adding variables
4. Test with a simple form submission and check the logs
