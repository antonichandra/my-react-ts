import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { FieldInput } from '../components/ui/field-component';
import { PageWrapper } from '../components/ui/PageWrapper';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/Card';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useFormData } from '../hooks/useFormData';

interface LoginBody {
  username: string;
  password: string;
}

export default function LoginPage() {
  const { formData, setError: setFormError, setFieldValue } = useFormData<LoginBody>();
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const username = formData.data.username;
    const password = formData.data.password;

    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    try {
      setError('');
      // Simulate checking - for demo, we might want to check for "admin" username
      const role = username.toLowerCase().includes('admin') ? 'admin' : 'user';
      await login(username, role);
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      setError('Login failed. Please try again.');
    }
  };

  const handleFieldChange = (field: keyof LoginBody, value: string) => {
    setFieldValue(field, value);
    // Clear error when user starts typing
    if (formData.error[field]) {
      setFormError(field, undefined);
    }
  };

  return (
    <PageWrapper maxWidth="md" className="w-full">
      <Card className="border-0 shadow-lg ring-1 ring-zinc-950/5 dark:ring-white/10">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight text-center">Welcome back</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <FieldInput
                label="Username"
                field="username"
                value={formData.data.username}
                onChange={(value) => handleFieldChange('username', value)}
                error={formData.error.username}
                props={{
                  type: 'text',
                  placeholder: 'Username (try admin)',
                }}
              />
              <FieldInput
                label="Password"
                field="password"
                value={formData.data.password}
                onChange={(value) => handleFieldChange('password', value)}
                error={formData.error.password}
                props={{
                  type: 'password',
                  placeholder: 'Password',
                }}
              />

              {error && (
                <div className="flex items-center p-3 text-sm text-red-600 bg-red-50 rounded-md dark:bg-red-950/50 dark:text-red-400">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {error}
                </div>
              )}

              <Button disabled={isLoading} className="w-full" type="submit">
                {isLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Sign In
              </Button>
            </div>
          </form>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-zinc-200 dark:border-zinc-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-zinc-500 dark:bg-zinc-950 dark:text-zinc-400">
                Or continue with
              </span>
            </div>
          </div>
          <Button variant="outline" type="button" disabled={isLoading} className="w-full">
            Gitbucket
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 text-center text-sm text-zinc-500">
          <p>Try 'admin' for admin role, any other for user role.</p>
        </CardFooter>
      </Card>
    </PageWrapper>
  );
}

