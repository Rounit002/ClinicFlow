import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('patient');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!username.trim() || !email.trim() || !phoneNumber.trim() || !password.trim()) {
      setError('All fields are required');
      setIsLoading(false);
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setError('Invalid phone number. Must be 10 digits.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('https://clinicflow-e7a9.onrender.com/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, phone_number: phoneNumber, password, role }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Registration failed');
      toast.success('Registration successful! Redirecting to login...');
      navigate('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
      toast.error('Registration failed. Please check your details.');
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
          <p className="mt-2 text-sm text-gray-500">Create a new account</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
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
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <motion.div whileHover={{ scale: 1.02 }} whileFocus={{ scale: 1.05 }}>
                <Input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1 bg-gray-50 text-gray-900 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
              </motion.div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <motion.div whileHover={{ scale: 1.02 }} whileFocus={{ scale: 1.05 }}>
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 bg-gray-50 text-gray-900 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
              </motion.div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <motion.div whileHover={{ scale: 1.02 }} whileFocus={{ scale: 1.05 }}>
                <Input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="mt-1 bg-gray-50 text-gray-900 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
              </motion.div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <motion.div whileHover={{ scale: 1.02 }} whileFocus={{ scale: 1.05 }}>
                <Input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 bg-gray-50 text-gray-900 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
              </motion.div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <motion.div whileHover={{ scale: 1.02 }} whileFocus={{ scale: 1.05 }}>
                <select
                  className="w-full p-2 mt-1 rounded-md bg-gray-50 text-gray-900 border-gray-300 focus:ring-2 focus:ring-blue-500 transition-all"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="patient">Patient</option>
                  <option value="admin">Admin</option>
                </select>
              </motion.div>
            </div>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              type="submit"
              className="w-full py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? 'Signing up...' : 'Sign up'}
            </Button>
          </motion.div>
          <div className="text-center text-sm text-gray-500">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="text-blue-500 hover:text-blue-600 hover:underline">Sign in</Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Register;