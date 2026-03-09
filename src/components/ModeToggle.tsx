import { Moon, Sun } from "lucide-react"
import { Button } from "./ui/Button"
import { useTheme } from "./ThemeProvider"
import { motion, AnimatePresence } from "framer-motion"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light")
    } else {
      setTheme("dark")
    }
    // "System" is a bit tricky with a simple toggle, 
    // so we cycle Light -> Dark. 
    // If you want system support, a dropdown is better. 
    // But for "super clean and fast", a toggle is nicer.
    // If needed we can add a long-press or separate UI for system.
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative w-9 h-9 rounded-full overflow-hidden hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
      title="Toggle theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
            key={theme === "dark" ? "dark" : "light"}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex items-center justify-center"
        >
            {theme === "dark" ? (
                 <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all text-zinc-50" />
            ) : (
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all text-zinc-900" />
            )}
        </motion.div>
      </AnimatePresence>
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
