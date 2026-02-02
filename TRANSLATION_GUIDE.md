# Translation Implementation Guide

## What's Been Completed

✅ Translation files created (`lib/translations/en.ts` and `lib/translations/ar.ts`)
✅ Language context and provider set up (`contexts/LanguageContext.tsx`)
✅ Floating language switcher component (`components/LanguageSwitcher.tsx`)
✅ RTL support added to CSS
✅ Updated components: Navbar, Hero, KeyFeatures

## Components Still Needing Translation Updates

The following components need to be updated to use translations:

1. **ProblemSolution.tsx** - Use `t.problemSolution.*`
2. **UseCases.tsx** - Use `t.useCases.*`
3. **Benefits.tsx** - Use `t.benefits.*`
4. **HowItWorks.tsx** - Use `t.howItWorks.*`
5. **DashboardPreview.tsx** - Use `t.dashboard.*`
6. **Testimonials.tsx** - Use `t.testimonials.*`
7. **Pricing.tsx** - Use `t.pricing.*`
8. **SecurityCompliance.tsx** - Use `t.security.*`
9. **Integrations.tsx** - Use `t.integrations.*`
10. **FAQ.tsx** - Use `t.faq.*` (needs FAQ items added to translations)
11. **FinalCTA.tsx** - Use `t.finalCTA.*`
12. **Footer.tsx** - Use `t.footer.*`

## Pattern to Follow

For each component:

1. Add `'use client'` directive if not already present
2. Import `useLanguage` hook:
   ```tsx
   import { useLanguage } from '@/contexts/LanguageContext'
   ```
3. Get translations and direction:
   ```tsx
   const { t, dir } = useLanguage()
   ```
4. Replace hardcoded text with `t.section.key`
5. Add RTL support classes where needed:
   ```tsx
   className={`${dir === 'rtl' ? 'text-right' : 'text-left'}`}
   className={`${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
   ```

## Example: Updating a Component

**Before:**
```tsx
export default function MyComponent() {
  return (
    <section>
      <h2>My Title</h2>
      <p>My description</p>
    </section>
  )
}
```

**After:**
```tsx
'use client'

import { useLanguage } from '@/contexts/LanguageContext'

export default function MyComponent() {
  const { t, dir } = useLanguage()
  
  return (
    <section>
      <h2 className={dir === 'rtl' ? 'text-right' : ''}>{t.mySection.title}</h2>
      <p className={dir === 'rtl' ? 'text-right' : ''}>{t.mySection.description}</p>
    </section>
  )
}
```

## RTL Considerations

- Use `dir === 'rtl'` checks for text alignment
- Reverse flex directions: `flex-row-reverse` for RTL
- Adjust margins: `ml-*` becomes `mr-*` in RTL
- Language switcher position: `left-6` in RTL, `right-6` in LTR

## Testing

1. Click the language switcher (bottom right/left)
2. Verify all text changes to Arabic
3. Check RTL layout is correct
4. Test navigation and interactions
5. Verify language persists on page refresh



