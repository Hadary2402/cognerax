# Fixing 403 Forbidden Error on Refresh

## The Problem

When you refresh `/request-demo/`, you get:
```
GET https://cogneraxai.com/request-demo/ 403 (Forbidden)
```

This happens because:
1. The server is trying to access a directory (`/request-demo/`) instead of a file
2. Directory listing is disabled (which is good for security)
3. The `.htaccess` rewrite rules might not be working

## The Solution

### Step 1: Make Sure `.htaccess` is in the `out` Directory

I've created `out/.htaccess` for you. This file needs to be uploaded to your GoDaddy server.

**Important:** The `.htaccess` file must be in the root directory of your website on GoDaddy (same level as `index.html`).

### Step 2: Upload `.htaccess` to GoDaddy

1. **After building your static site:**
   ```bash
   npm run build
   ```

2. **Check that `out/.htaccess` exists:**
   - The file should be in the `out` directory
   - It should contain the rewrite rules

3. **Upload to GoDaddy:**
   - Upload the entire `out` directory to your GoDaddy hosting
   - Make sure `.htaccess` is included (it's a hidden file, so make sure your FTP client shows hidden files)
   - The `.htaccess` file should be in the root directory (same level as `index.html`)

### Step 3: Verify File Permissions

On GoDaddy, make sure:
- `.htaccess` file has read permissions (644 or 755)
- All HTML files have read permissions
- Directories have execute permissions (755)

### Step 4: Test the Rewrite Rules

After uploading, test these URLs:
- `https://cogneraxai.com/request-demo` (should work)
- `https://cogneraxai.com/request-demo/` (should redirect to without trailing slash)
- `https://cogneraxai.com/request-demo.html` (should also work)

## Alternative: Fix the Trailing Slash Issue

If `.htaccess` isn't working, you can also:

1. **Access the page without trailing slash:**
   - Use `https://cogneraxai.com/request-demo` (no trailing slash)
   - The rewrite rule should handle this

2. **Update your links:**
   - Make sure all internal links use `/request-demo` (no trailing slash)
   - Check `components/Navbar.tsx` and other components

## Troubleshooting

### Still Getting 403?

1. **Check if `.htaccess` is uploaded:**
   - Use FTP/SFTP to verify the file exists on the server
   - Make sure it's in the root directory (not in a subdirectory)

2. **Check GoDaddy settings:**
   - Some GoDaddy plans don't support `.htaccess`
   - Contact GoDaddy support to enable `.htaccess` support
   - Or upgrade to a plan that supports it

3. **Check file permissions:**
   - `.htaccess` should be 644
   - Directories should be 755
   - Files should be 644

4. **Test the rewrite rules:**
   - Try accessing `https://cogneraxai.com/request-demo.html` directly
   - If that works, the rewrite rules aren't working
   - If that also gives 403, it's a permissions issue

5. **Check GoDaddy error logs:**
   - Go to GoDaddy hosting control panel
   - Check error logs for more details about the 403 error

### If `.htaccess` Doesn't Work

If GoDaddy doesn't support `.htaccess` or it's not working:

1. **Use direct file access:**
   - Update all links to use `.html` extension: `/request-demo.html`
   - This will work without rewrite rules

2. **Contact GoDaddy support:**
   - Ask them to enable `.htaccess` support
   - Or ask for help configuring URL rewriting

3. **Consider alternative hosting:**
   - Vercel (free, supports Next.js perfectly)
   - Netlify (free, good for static sites)
   - Both support Next.js routing out of the box

## Quick Fix Summary

1. ✅ I've created `out/.htaccess` with the correct rewrite rules
2. 📤 Upload the `out` directory to GoDaddy (including `.htaccess`)
3. ✅ Make sure `.htaccess` is in the root directory
4. ✅ Verify file permissions (644 for files, 755 for directories)
5. 🔄 Test the URL: `https://cogneraxai.com/request-demo`

After this, the 403 error should be fixed! 🎉
