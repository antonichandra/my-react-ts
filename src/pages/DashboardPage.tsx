
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Pencil, ArrowLeft, Plus } from 'lucide-react';

import { ModeToggle } from '../components/ModeToggle';
import { PageWrapper } from '../components/ui/PageWrapper';
import { useState, useRef } from 'react';
import { NumericFormat } from 'react-number-format';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [percentage, setPercentage] = useState<string>('');
 

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8">
      <PageWrapper>
        <header className="flex justify-between items-center gap-4 mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Dashboard</h1>
            <div className="flex items-center gap-3 sm:gap-4">
                <ModeToggle />
                <Button variant="outline" onClick={logout} className="justify-center p-2 sm:px-4">
                    <span className="hidden sm:inline">Sign Out</span>
                    <ArrowLeft className="h-4 w-4 sm:hidden rotate-180" />
                </Button>
            </div>
        </header>

        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
            <Card>
                <CardHeader className="flex flex-row justify-between space-y-0 p-4 sm:p-6 pb-2">
                    <div>
                        <CardTitle className="text-base sm:text-lg">User Profile</CardTitle>
                        <CardDescription className="text-xs sm:text-sm">Your current session details</CardDescription>
                    </div>
                    <div className='flex flex-col space-y-1'>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => navigate('/profile/edit')}
                            className="p-2 sm:px-3"
                        >
                            <Pencil className="h-4 w-4 sm:mr-2" />
                            <span className="hidden sm:inline">Edit Profile</span>
                        </Button>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => navigate('/product')}
                            className="p-2 sm:px-3"
                        >
                            <Plus className="h-4 w-4 sm:mr-2" />
                            <span className="hidden sm:inline">Product</span>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-2 p-4 sm:p-6 pt-4">
                    <div className="flex justify-between py-2 border-b border-zinc-100 dark:border-zinc-800">
                        <span className="font-medium text-zinc-500">Name</span>
                        <span>{user?.name}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-zinc-100 dark:border-zinc-800">
                        <span className="font-medium text-zinc-500">Username</span>
                        <span>{user?.username}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-zinc-100 dark:border-zinc-800">
                        <span className="font-medium text-zinc-500">Role</span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100 uppercase">
                            {user?.role}
                        </span>
                    </div>
                     <div className="flex justify-between py-2">
                        <span className="font-medium text-zinc-500">ID</span>
                        <span className="font-mono text-xs text-zinc-400">{user?.id}</span>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="text-base sm:text-lg">Quick Stats</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">Overview of your activity</CardDescription>
                </CardHeader>
                 <CardContent className="p-4 sm:p-6">
                    <div className="rounded-lg bg-zinc-100 dark:bg-zinc-900 p-6 sm:p-8 flex items-center justify-center">
                        <p className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm">No activity recorded yet.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
      </PageWrapper>
    </div>
  );
}

