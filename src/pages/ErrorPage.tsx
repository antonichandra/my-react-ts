import { Button } from '../components/ui/Button'
import { useNavigate, useRouteError } from 'react-router-dom'
import { motion } from 'framer-motion'
import { RotateCcw } from 'lucide-react'

export default function ErrorPage() {
  const navigate = useNavigate()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const error: any = useRouteError();
  console.error(error);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center space-y-6 max-w-md"
      >
        <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Something went wrong</h1>
            <p className="text-zinc-600 dark:text-zinc-400">
             {error?.statusText || error?.message || "An unexpected error occurred."}
            </p>
        </div>
        
        <div className="pt-4 flex justify-center gap-4">
            <Button variant="outline" onClick={() => window.location.reload()}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Reload
            </Button>
            <Button onClick={() => navigate('/')}>
                Go Home
            </Button>
        </div>
      </motion.div>
    </div>
  )
}
