# Testing Which Vercel URL to Use

## Quick Test

Open your browser console and test both URLs:

### Test 1: Project URL
```javascript
fetch('https://cognerax-mohamed-elhadarys-projects-71d8c079.vercel.app/api/contact', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({test: true})
})
.then(r => r.text())
.then(text => console.log('Project URL response:', text.substring(0, 200)))
```

### Test 2: Clean URL
```javascript
fetch('https://cognerax.vercel.app/api/contact', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({test: true})
})
.then(r => r.text())
.then(text => console.log('Clean URL response:', text.substring(0, 200)))
```

## Which One to Use?

**Use the one that:**
- ✅ Returns JSON (not HTML/404)
- ✅ Shows API error messages (like "Email is required")
- ✅ Works consistently

**Usually:**
- `cognerax.vercel.app` = Main production URL (use this if it works)
- `cognerax-mohamed-elhadarys-projects-71d8c079.vercel.app` = Project-specific URL (backup)

## Recommendation

**Use `cognerax.vercel.app`** if it works - it's cleaner and more professional.

If `cognerax.vercel.app` doesn't work, use the project URL.
