import type { Metadata } from 'next'
import { Inter, Cairo } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { ThemeProvider } from '@/contexts/ThemeContext'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const cairo = Cairo({ 
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo',
  weight: ['300', '400', '500', '600', '700', '800', '900']
})

export const metadata: Metadata = {
  title: 'CogneraXAI - Nexora | Legal AI Copilot Specialized in UAE Law',
  description: 'Nexora is your legal AI copilot specialized in UAE law. Streamline case management, client relations, and document organization with intelligent automation built for the UAE legal market.',
  icons: {
    icon: '/favico.png',
    apple: '/favico.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favico.png" type="image/png" />
        <link rel="apple-touch-icon" href="/CogneraX-Logo.png" />
        <link rel="shortcut icon" href="/CogneraX-Logo.png" type="image/png" />
        <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  if (typeof document !== 'undefined' && document.documentElement) {
                    const theme = localStorage.getItem('theme');
                    if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                      document.documentElement.classList.add('dark');
                    } else {
                      document.documentElement.classList.remove('dark');
                    }
                  }
                } catch (e) {
                  console.error('Theme script error:', e);
                }
              })();
            `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Set API base URL from environment variable or default to empty (relative paths)
                const apiBaseUrl = ${JSON.stringify(process.env.NEXT_PUBLIC_API_BASE_URL || '')};
                window.__API_BASE_URL__ = apiBaseUrl;
                
                // Debug logging (only in development or if URL is set)
                if (apiBaseUrl) {
                  console.log('[API Config] API Base URL set to:', apiBaseUrl);
                } else {
                  console.warn('[API Config] ⚠️ NEXT_PUBLIC_API_BASE_URL is not set!');
                  console.warn('[API Config] Forms will use relative paths which won\'t work with static hosting.');
                }
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} ${cairo.variable} font-sans`} suppressHydrationWarning>
        <ThemeProvider>
          <LanguageProvider>{children}</LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

