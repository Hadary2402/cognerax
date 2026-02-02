# Setting Up Environment Variables in Vercel

## The Problem
Your Turnstile secret key needs to be in **Vercel's environment variables**, not just `.env.local`. 

- `.env.local` = Only for local development/builds
- **Vercel Environment Variables** = Used when API routes run on Vercel

## Solution: Add Environment Variables to Vercel

### Step 1: Go to Vercel Dashboard
1. Visit https://vercel.com/dashboard
2. Click on your project
3. Go to **Settings** → **Environment Variables**

### Step 2: Add All Required Variables
Click **Add New** and add each of these:

#### 1. Resend API Keys
```
Name: RESEND_API_KEY
Value: re_9Y9UWUcY_Gs6bcoiRVrqwYcuqwMhNATDj
Environment: Production, Preview, Development (select all)
```

```
Name: RESEND_API_KEY_CONTACT
Value: re_ThdAv52N_D8AYaoquFtx5FHgL23jPpQvc
Environment: Production, Preview, Development
```

```
Name: RESEND_API_KEY_NEWSLETTER
Value: re_Cm4117QP_M9UFJQkkyyC6H1jP83SXiRiE
Environment: Production, Preview, Development
```

```
Name: RESEND_API_KEY_REQUEST_DEMO
Value: re_9Y9UWUcY_Gs6bcoiRVrqwYcuqwMhNATDj
Environment: Production, Preview, Development
```

#### 2. Turnstile Secret Key (CRITICAL!)
```
Name: TURNSTILE_SECRET_KEY
Value: [Your Turnstile Secret Key]
Environment: Production, Preview, Development
```

**To find your Turnstile Secret Key:**
1. Go to https://dash.cloudflare.com
2. Navigate to **Turnstile**
3. Click on your site (the one with site key `0x4AAAAAACBPITLIpkr5lgfq`)
4. You'll see the **Secret Key** - copy it
5. Paste it as the value above

#### 3. Resend Audience ID
```
Name: RESEND_AUDIENCE_ID
Value: [Your Audience ID]
Environment: Production, Preview, Development
```

**To find your Resend Audience ID:**
1. Go to https://resend.com/audiences
2. Find your audience
3. Copy the Audience ID

### Step 3: Redeploy
After adding all variables:
1. Go to **Deployments** tab
2. Click the **three dots (⋯)** on the latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete

### Step 4: Test
1. Go to your website
2. Try submitting a form
3. Check Vercel logs (Deployments → Click deployment → Functions tab)
4. Look for: `[Newsletter API] Turnstile verification successful`

## Important Notes

- **Secret Key vs Site Key:**
  - **Site Key** (`0x4AAAAAACBPITLIpkr5lgfq`) = Used in frontend (already in your code)
  - **Secret Key** = Used in backend API (needs to be in Vercel env vars)

- **Environment Selection:**
  - Select **Production, Preview, Development** for all variables
  - This ensures they work in all environments

- **After Adding Variables:**
  - You MUST redeploy for changes to take effect
  - Old deployments still use old environment variables

## Verify It's Working

After redeploying, check Vercel function logs:
1. Go to Deployments
2. Click on latest deployment
3. Go to **Functions** tab
4. Try submitting a form
5. Check logs - you should see:
   - `[Newsletter API] Turnstile verification successful`
   - NOT: `Turnstile verification failed`

## Troubleshooting

### Still Getting "Verification Failed"?
1. **Double-check the Secret Key:**
   - Make sure you copied the **Secret Key** (not Site Key)
   - Secret Key is longer and different from Site Key

2. **Check Vercel Logs:**
   - Look for error messages about Turnstile
   - Check if `TURNSTILE_SECRET_KEY` is undefined

3. **Verify Domain Match:**
   - Make sure your production domain is added to Turnstile
   - Both site key and secret key must be for the same Turnstile site

4. **Redeploy:**
   - Environment variables only apply to NEW deployments
   - Redeploy after adding variables
