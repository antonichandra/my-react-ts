import { Button } from '../components/ui/Button'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-6 max-w-md"
      >
        <h1 className="text-9xl font-bold tracking-tighter text-zinc-900/10 dark:text-white/10">404</h1>
        <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Page Not Found</h2>
            <p className="text-zinc-600 dark:text-zinc-400">
            The page you are looking for doesn't exist or has been moved.
            </p>
        </div>
        
        <div className="pt-4">
            <Button size="lg" onClick={() => navigate('/')}>
                Take me Home
            </Button>
        </div>
      </motion.div>
    </div>
  )
}
