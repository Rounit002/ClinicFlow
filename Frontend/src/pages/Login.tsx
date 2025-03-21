import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle } from 'lucide-react';

const Login = () => {
  const [loginIdentifier, setLoginIdentifier] = useState(''); // ✅ Username or Phone Number
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // ✅ Validate inputs
    if (!loginIdentifier.trim() || !password.trim()) {
      setError('Please enter username/phone and password');
      setIsLoading(false);
      return;
    }

    try {
      console.log('Attempting login with:', { loginIdentifier, password });

      const response = await fetch('https://clinicflow-e7a9.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ loginIdentifier, password }), // ✅ Send username OR phone
        credentials: 'include',
      });

      console.log('Login response status:', response.status);
      const data = await response.json();
      console.log('Login response data:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('user', JSON.stringify({
        username: data.user.username,
        phone_number: data.user.phone_number,
        role: data.user.role,
        isLoggedIn: true
      }));
      localStorage.setItem('token', data.token);

      if (data.user.role === 'admin') {
        toast.success('Welcome back, Admin!');
        navigate('/dashboard');
      } else {
        toast.success('Login successful!');
        navigate('/patient/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
      toast.error('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-clinic-50 to-white">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-md border">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-clinic-600 flex items-center justify-center">
            <span className="text-white font-bold text-xl">CM</span>
          </div>
          <h2 className="mt-6 text-3xl font-bold">Clinic Management</h2>
          <p className="mt-2 text-sm text-muted-foreground">Sign in to your account</p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-md bg-red-100 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm">{error}</p>
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Username or Phone</label>
              <Input
                type="text"
                required
                className="mt-1"
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium">Password</label>
              <Input
                type="password"
                required
                className="mt-1"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-clinic-600 hover:bg-clinic-700" 
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
          
          <div className="text-center text-sm text-muted-foreground">
            <p>Don't have an account? 
              <a 
                href="/register" 
                className="text-clinic-600 hover:underline ml-1"
              >
                Sign up here
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;