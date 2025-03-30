import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!loginIdentifier.trim() || !password.trim()) {
      setError('Please enter username/phone and password');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('https://clinicflow-e7a9.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loginIdentifier, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Login failed');

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
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
      toast.error('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gray-50">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-lg border border-gray-200"
      >
        <div className="text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-blue-500 flex items-center justify-center">
            <span className="text-white font-bold text-2xl">CM</span>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Clinic Management</h2>
          <p className="mt-2 text-sm text-gray-500">Sign in to your account</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2 p-3 rounded-md bg-red-100 text-red-600"
            >
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm">{error}</p>
            </motion.div>
          )}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <motion.div whileHover={{ scale: 1.02 }} whileFocus={{ scale: 1.05 }}>
                <Input
                  type="text"
                  required
                  className="mt-1 bg-gray-50 text-gray-900 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                />
              </motion.div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <motion.div whileHover={{ scale: 1.02 }} whileFocus={{ scale: 1.05 }}>
                <Input
                  type="password"
                  required
                  className="mt-1 bg-gray-50 text-gray-900 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </motion.div>
            </div>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              type="submit"
              className="w-full py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </motion.div>
          <div className="text-center text-sm text-gray-500">
            <p>
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-500 hover:text-blue-600 hover:underline">Sign up here</Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;