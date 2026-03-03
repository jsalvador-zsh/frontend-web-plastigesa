"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { motion } from "motion/react"

export function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-9 h-9 flex items-center justify-center rounded-full bg-transparent overflow-hidden">
        <div className="w-5 h-5" />
      </div>
    )
  }

  const isDarkMode = theme === "dark" || (theme === "system" && systemTheme === "dark")

  return (
    <button
      onClick={() => setTheme(isDarkMode ? "light" : "dark")}
      className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black/5 dark:bg-white/10 text-foreground transition-colors hover:bg-black/10 dark:hover:bg-white/20 focus-visible:outline-none overflow-hidden"
      aria-label="Alternar tema de color"
    >
      <motion.div
        initial={false}
        animate={{
          scale: isDarkMode ? 0 : 1,
          opacity: isDarkMode ? 0 : 1,
          rotate: isDarkMode ? -90 : 0,
        }}
        transition={{ duration: 0.3, ease: "backOut" }}
        className="absolute"
      >
        <Sun className="h-4 w-4" />
      </motion.div>

      <motion.div
        initial={false}
        animate={{
          scale: isDarkMode ? 1 : 0,
          opacity: isDarkMode ? 1 : 0,
          rotate: isDarkMode ? 0 : 90,
        }}
        transition={{ duration: 0.3, ease: "backOut" }}
        className="absolute"
      >
        <Moon className="h-4 w-4" />
      </motion.div>
    </button>
  )
}
