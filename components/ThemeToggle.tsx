'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
      aria-label="Toggle dark mode"
    >
      {theme === 'dark' ? (
        <Sun size={24} className="text-yellow-300" />
      ) : (
        <Moon size={24} />
      )}
    </button>
  )
}



