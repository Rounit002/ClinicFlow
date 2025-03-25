import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import Link
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle } from 'lucide-react';

const Register: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [role, setRole] = useState<string>('patient');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, phone_number: phoneNumber, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

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
    <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-clinic-50 to-white">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-md border">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-clinic-600 flex items-center justify-center">
            <span className="text-white font-bold text-xl">CM</span>
          </div>
          <h2 className="mt-6 text-3xl font-bold">Clinic Management</h2>
          <p className="mt-2 text-sm text-muted-foreground">Create a new account</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-md bg-red-100 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Username</label>
              <Input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>

            <div>
              <label className="block text-sm font-medium">Email</label>
              <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div>
              <label className="block text-sm font-medium">Phone Number</label>
              <Input type="tel" required value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
            </div>

            <div>
              <label className="block text-sm font-medium">Password</label>
              <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            <div>
              <label className="block text-sm font-medium">Role</label>
              <select className="w-full p-2 border rounded-md" value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="patient">Patient</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <Button type="submit" className="w-full bg-clinic-600 hover:bg-clinic-700" disabled={isLoading}>
            {isLoading ? 'Signing up...' : 'Sign up'}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            <p>Already have an account? <Link to="/login" className="text-clinic-600 hover:underline">Sign in</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;