import { Button } from '../components/ui/Button'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';

export default function UnauthorizedPage() {
  const navigate = useNavigate()

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 p-4">
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center text-center space-y-6 max-w-md"
        >
            <div className="p-4 rounded-full bg-zinc-100 dark:bg-zinc-900">
                <ShieldAlert className="w-12 h-12 text-zinc-900 dark:text-zinc-50" />
            </div>
            
            <h1 className="text-3xl font-bold tracking-tight">Access Denied</h1>
            
            <p className="text-zinc-600 dark:text-zinc-400">
                You do not have permission to view this page. Please contact your administrator if you believe this is a mistake.
            </p>

            <div className="flex gap-4">
                <Button variant="outline" onClick={() => navigate(-1)}>
                    Go Back
                </Button>
                <Button onClick={() => navigate('/')}>
                    Go Home
                </Button>
            </div>
        </motion.div>
    </div>
  )
}
