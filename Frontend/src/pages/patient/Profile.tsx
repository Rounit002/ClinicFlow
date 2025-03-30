import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTitle from '@/components/ui/PageTitle';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Edit, Save, User, Lock, Mail, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const Profile = () => {
  const [user, setUser] = useState({ username: '', email: '', phone_number: '', role: 'patient' });
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ ...user });
  const [passwordData, setPasswordData] = useState({ newPassword: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return setError('No authentication token found. Please log in again.');
        const response = await fetch(`https://clinicflow-e7a9.onrender.com/api/appointments/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error((await response.json()).message || `Failed to fetch profile (Status: ${response.status})`);
        const data = await response.json();
        setUser(data);
        setFormData(data);
      } catch (error) {
        setError(error.message || 'Failed to load profile. Please try again.');
        toast.error(error.message || 'Failed to load profile');
      }
    };
    fetchUserProfile();
  }, [navigate]);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handlePasswordChange = (e) => setPasswordData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return setError('No authentication token found. Please log in again.');
      const updateData = { ...formData };
      if (passwordData.newPassword) {
        if (passwordData.newPassword !== passwordData.confirmPassword) return toast.error('New password and confirmation do not match');
        updateData.password = passwordData.newPassword;
      }
      const response = await fetch(`https://clinicflow-e7a9.onrender.com/api/appointments/user/profile`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(updateData),
      });
      if (!response.ok) throw new Error((await response.json()).message || 'Failed to update profile');
      const updatedUser = await response.json();
      setUser(updatedUser.user);
      setFormData(updatedUser.user);
      setPasswordData({ newPassword: '', confirmPassword: '' });
      setEditing(false);
      setError('');
      toast.success('Profile updated successfully', { style: { background: '#2ECC71', color: 'white' } });
    } catch (error) {
      setError(error.message || 'Failed to update profile. Please try again.');
      toast.error(error.message || 'Failed to update profile');
    }
  };

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-6 p-6 bg-gray-50 min-h-screen"
      >
        <PageTitle title="My Profile" description="View and manage your personal information" />
        <Card className="shadow-lg rounded-xl border border-gray-100 bg-white">
          <CardContent className="p-6">
            <div className="text-red-600 font-medium">{error}</div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => navigate('/login')}
                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-6 py-2 shadow-md"
              >
                Go to Login
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
      className="space-y-6 p-6 bg-gray-50 min-h-screen relative overflow-hidden"
    >
      {/* Pseudo-element for background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/subtle-clinic-bg.jpg)', opacity: 0.1 }}
      />
      <div className="relative z-10">
        <PageTitle
          title="My Profile"
          description="Manage your clinic profile with ease"
          className="text-blue-700"
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="md:col-span-1"
          >
            <Card className="shadow-lg rounded-xl border border-gray-100 bg-white">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-28 w-28 mb-4 border-2 border-blue-500 p-1 rounded-full">
                    <AvatarImage src="" alt={user.username} />
                    <AvatarFallback className="text-3xl bg-blue-100 text-blue-700 font-bold">
                      {user.username ? user.username.split(' ').map(n => n[0]).join('') : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-2xl font-bold text-gray-800">{user.username}</h3>
                  <p className="text-sm text-gray-600 mt-1 capitalize">Role: {user.role}</p>
                  <div className="w-full mt-6 space-y-3">
                    <div className="flex items-center gap-3 text-sm text-gray-700">
                      <Mail className="h-5 w-5 text-blue-500" />
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-700">
                      <Phone className="h-5 w-5 text-blue-500" />
                      <span>{user.phone_number}</span>
                    </div>
                  </div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-2 shadow-md"
                      onClick={() => setEditing(true)}
                      disabled={editing}
                    >
                      <Edit className="h-5 w-5 mr-2" /> Edit Profile
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="md:col-span-2"
          >
            <Card className="shadow-lg rounded-xl border border-gray-100 bg-white">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold text-gray-800">Profile Information</CardTitle>
                  {editing && (
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={handleSave}
                        className="bg-orange-400 hover:bg-orange-500 text-white rounded-lg px-4 py-2 shadow-md"
                      >
                        <Save className="h-5 w-5 mr-2" /> Save Changes
                      </Button>
                    </motion.div>
                  )}
                </div>
                <CardDescription className="text-gray-600">
                  {editing ? 'Update your details below' : 'Your clinic account details'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="personal" className="w-full">
                  <TabsList className="mb-4 grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded-lg">
                    <TabsTrigger
                      value="personal"
                      className="data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-md py-2"
                    >
                      <User className="h-5 w-5 mr-2" /> Personal
                    </TabsTrigger>
                    <TabsTrigger
                      value="security"
                      className="data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-md py-2"
                    >
                      <Lock className="h-5 w-5 mr-2" /> Security
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="personal" className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="username" className="font-semibold text-gray-700">Username</Label>
                        <motion.div whileHover={{ scale: 1.02 }} whileFocus={{ scale: 1.05 }}>
                          <Input
                            id="username"
                            name="username"
                            value={editing ? formData.username : user.username}
                            onChange={handleChange}
                            disabled={!editing}
                            className="border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg"
                          />
                        </motion.div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="font-semibold text-gray-700">Email</Label>
                        <motion.div whileHover={{ scale: 1.02 }} whileFocus={{ scale: 1.05 }}>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={editing ? formData.email : user.email}
                            onChange={handleChange}
                            disabled={!editing}
                            className="border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg"
                          />
                        </motion.div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone_number" className="font-semibold text-gray-700">Phone Number</Label>
                        <motion.div whileHover={{ scale: 1.02 }} whileFocus={{ scale: 1.05 }}>
                          <Input
                            id="phone_number"
                            name="phone_number"
                            value={editing ? formData.phone_number : user.phone_number}
                            onChange={handleChange}
                            disabled={!editing}
                            className="border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg"
                          />
                        </motion.div>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="security" className="space-y-6">
                    <Card className="border border-gray-100 rounded-xl bg-white">
                      <CardContent className="pt-6">
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">Password</h3>
                        <p className="text-sm text-gray-600 mb-4">Update your password for enhanced security</p>
                        <div className="space-y-6">
                          <div className="space-y-2">
                            <Label htmlFor="newPassword" className="font-semibold text-gray-700">New Password</Label>
                            <motion.div whileHover={{ scale: 1.02 }} whileFocus={{ scale: 1.05 }}>
                              <Input
                                id="newPassword"
                                name="newPassword"
                                type="password"
                                value={passwordData.newPassword}
                                onChange={handlePasswordChange}
                                disabled={!editing}
                                className="border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg"
                              />
                            </motion.div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="font-semibold text-gray-700">Confirm New Password</Label>
                            <motion.div whileHover={{ scale: 1.02 }} whileFocus={{ scale: 1.05 }}>
                              <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                value={passwordData.confirmPassword}
                                onChange={handlePasswordChange}
                                disabled={!editing}
                                className="border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg"
                              />
                            </motion.div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;